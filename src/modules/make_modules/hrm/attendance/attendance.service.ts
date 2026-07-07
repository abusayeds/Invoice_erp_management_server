import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import queryBuilder from "../../../../builder/queryBuilder";
import {
  HrmAttendanceModel,
  HrmEmployeeModel,
  HrmHolidayModel,
  HrmIpRestrictModel,
  HrmLeaveApplicationModel,
  HrmShiftModel,
} from "../models";
import {
  applyOwnershipToQuery,
  companyObjectId,
  companyScope,
  creatorObjectId,
  formatDateOnly,
  parseDate,
  resolveActorUserId,
  resolveCompanyId,
  resolveOwnership,
  spansCalendarDay,
  startOfDay,
} from "../shared/hrm.utils";
import { assertEnumValue, ATTENDANCE_STATUS } from "../shared/hrm.statusValidation";
import {
  assertCompanyDocument,
  assertCompanyEmployeeUser,
  parseObjectId,
  parseOptionalObjectId,
} from "../shared/hrm.refValidation";
import { AuthRequest } from "../../../../middlewares/auth";
import { permModule } from "../../../../utils/permissionModule";
import { getHrmCompanySettings } from "../shared/hrm.settings.service";
import { withBulkDeleteAuthId } from "../../../../utils/bulkDelete";

const formatAttendance = (row: Record<string, unknown>) => ({
  ...row,
  _id: row._id ? String(row._id) : undefined,
  date: formatDateOnly(row.date as Date),
});

const formatAttendanceDoc = (doc: { toObject?: () => Record<string, unknown> } | Record<string, unknown>) =>
  formatAttendance(
    typeof (doc as { toObject?: () => Record<string, unknown> }).toObject === "function"
      ? (doc as { toObject: () => Record<string, unknown> }).toObject()
      : (doc as Record<string, unknown>),
  );

type AttendanceBlockCode = "COMPANY_HOLIDAY" | "ON_LEAVE" | "NON_WORKING_DAY";

type AttendanceDayEligibility = {
  allowed: boolean;
  code: AttendanceBlockCode | null;
  message: string;
};

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Checks holiday → approved leave → non-working day (weekend/off). */
const getAttendanceDayEligibility = async (
  companyId: string,
  employeeUserId: string,
  date: Date,
  dayIndex = date.getDay(),
): Promise<AttendanceDayEligibility> => {
  const scope = companyScope(companyId);
  const employeeOid = companyObjectId(employeeUserId);

  const holiday = await HrmHolidayModel.findOne({
    ...scope,
    ...spansCalendarDay(date),
  })
    .select("name")
    .lean();
  if (holiday) {
    return {
      allowed: false,
      code: "COMPANY_HOLIDAY",
      message: `Today is a company holiday (${holiday.name}). Clock-in is not allowed.`,
    };
  }

  const leave = await HrmLeaveApplicationModel.findOne({
    ...scope,
    employee_id: { $in: [employeeOid, employeeUserId] },
    status: "approved",
    ...spansCalendarDay(date),
  })
    .populate("leave_type_id", "name")
    .lean();
  if (leave) {
    const leaveType = leave.leave_type_id as { name?: string } | null;
    const typeLabel = leaveType?.name ? `${leaveType.name} leave` : "approved leave";
    return {
      allowed: false,
      code: "ON_LEAVE",
      message: `You are on ${typeLabel} today. Clock-in is not allowed.`,
    };
  }

  const settings = await getHrmCompanySettings(companyId);
  if (!settings.working_days.includes(dayIndex)) {
    return {
      allowed: false,
      code: "NON_WORKING_DAY",
      message: `Today (${WEEKDAY_NAMES[dayIndex]}) is not a working day for your company. Clock-in is not allowed.`,
    };
  }

  return {
    allowed: true,
    code: null,
    message: "You can clock in today.",
  };
};

const assertCanClockIn = async (
  companyId: string,
  employeeUserId: string,
  date: Date,
  dayIndex = date.getDay(),
) => {
  const eligibility = await getAttendanceDayEligibility(companyId, employeeUserId, date, dayIndex);
  if (!eligibility.allowed) {
    throw new AppError(httpStatus.BAD_REQUEST, eligibility.message);
  }
};

const removeOne = async (req: AuthRequest, oneId: string) => {
  const companyId = resolveCompanyId(req);
  const updated = await HrmAttendanceModel.findOneAndUpdate(
    { _id: oneId, ...companyScope(companyId) },
    { isDeleted: true },
    { new: true }
  );
  if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Attendance not found");
  return { _id: oneId };
};

const remove = withBulkDeleteAuthId(removeOne);

export const attendanceService = {
  async list(req: AuthRequest, query: Record<string, unknown>) {
    const companyId = resolveCompanyId(req);
    const ownership = resolveOwnership(
      req,
      permModule.manageAny("attendances"),
      permModule.manageOwn("attendances"),
    );
    const base = applyOwnershipToQuery(companyScope(companyId), ownership, { employeeField: true });
    if (query.employee_id) (base as Record<string, unknown>).employee_id = query.employee_id;
    let mq = HrmAttendanceModel.find(base).select("_id employee_id shift_id date clock_in clock_out status notes").populate("employee_id", "name email").populate("shift_id", "shift_name");
    const qb = new queryBuilder(mq, query).filter().sort().fields();
    const { totalData } = await qb.paginate(HrmAttendanceModel.find(base));
    const rows = await qb.modelQuery.lean().exec();
    const pagination = qb.calculatePagination({
      totalData,
      currentPage: Number(query?.page) || 1,
      limit: Number(query?.limit) || 10,
    });
    return {
      data: (rows as Record<string, unknown>[]).map(formatAttendance),
      pagination,
    };
  },

  async createManual(req: AuthRequest, body: Record<string, unknown>) {
    const companyId = resolveCompanyId(req);
    const employee_id = parseObjectId(body.employee_id, "employee_id", "Employee");
    await assertCompanyEmployeeUser(companyId, employee_id, "Employee");
    const shiftRaw = parseOptionalObjectId(body.shift_id, "shift_id", "Shift");
    if (shiftRaw) {
      await assertCompanyDocument(companyId, HrmShiftModel, shiftRaw, "Shift");
      body.shift_id = companyObjectId(shiftRaw);
    }
    const date = startOfDay(parseDate(body.date, "date"));
    const existing = await HrmAttendanceModel.findOne({
      ...companyScope(companyId),
      employee_id,
      date
    });
    if (existing) {
      if (body.status !== undefined) {
        existing.status = assertEnumValue(body.status, ATTENDANCE_STATUS, "status") as never;
      }
      await existing.save();
      return { action: "updated" as const, data: formatAttendanceDoc(existing) };
    }

    await assertCanClockIn(companyId, employee_id, date);
    const doc = await HrmAttendanceModel.create({
      employee_id,
      shift_id: body.shift_id,
      date,
      clock_in: body.clock_in ? new Date(String(body.clock_in)) : new Date(),
      clock_out: body.clock_out ? new Date(String(body.clock_out)) : undefined,
      status:
        body.status !== undefined
          ? (assertEnumValue(body.status, ATTENDANCE_STATUS, "status") as never)
          : "present",
      notes: body.notes,
      user_id: companyScope(companyId).user_id,
      creator_id: creatorObjectId(req),
      isDeleted: false,
    });
    return { action: "created" as const, data: formatAttendanceDoc(doc) };
  },

  async clockStatus(req: AuthRequest) {
    const companyId = resolveCompanyId(req);
    const employeeId = resolveActorUserId(req);
    const now = new Date();
    const today = startOfDay(now);
    const [todayRow, pending, eligibility] = await Promise.all([
      HrmAttendanceModel.findOne({
        ...companyScope(companyId),
        employee_id: employeeId,
        date: today,
      }).lean(),
      HrmAttendanceModel.findOne({
        ...companyScope(companyId),
        employee_id: employeeId,
        clock_out: { $exists: false },
        clock_in: { $exists: true },
      })
        .sort({ clock_in: -1 })
        .lean(),
      getAttendanceDayEligibility(companyId, employeeId, today, now.getDay()),
    ]);
    const alreadyClockedIn = Boolean(todayRow?.clock_in);
    return {
      can_clock_in: !alreadyClockedIn && eligibility.allowed,
      can_clock_out: alreadyClockedIn,
      clock_in_blocked: !alreadyClockedIn && !eligibility.allowed,
      block_code: eligibility.code,
      block_message: eligibility.allowed ? null : eligibility.message,
      today_attendance: todayRow ? formatAttendance(todayRow as Record<string, unknown>) : null,
      pending_clock_out: pending
        ? formatAttendance(pending as Record<string, unknown>)
        : null,
    };
  },

  async clockIn(req: AuthRequest, ip?: string) {
    const companyId = resolveCompanyId(req);
    const employeeId = resolveActorUserId(req);
    const settings = await getHrmCompanySettings(companyId);
    if (settings.ip_restrict === "on" && ip) {
      const allowed = await HrmIpRestrictModel.exists({ ...companyScope(companyId), ip });
      if (!allowed) throw new AppError(httpStatus.FORBIDDEN, "This IP is not allowed to clock in & clock out");
    }
    const now = new Date();
    const today = startOfDay(now);
    await assertCanClockIn(companyId, employeeId, today, now.getDay());
    const profile = await HrmEmployeeModel.findOne({
      ...companyScope(companyId),
      employee_user_id: employeeId,
      isDeleted: false,
    }).lean();
    if (!profile?.shift_id) throw new AppError(httpStatus.BAD_REQUEST, "Employee shift is not configured");
    const open = await HrmAttendanceModel.findOne({
      ...companyScope(companyId),
      employee_id: employeeId,
      clock_out: { $exists: false },
      date: today,
    });
    if (open) throw new AppError(httpStatus.CONFLICT, "Please clock out from pending attendance first");
    const existing = await HrmAttendanceModel.findOne({
      ...companyScope(companyId),
      employee_id: employeeId,
      date: today,
    });
    if (existing?.clock_in) {
      throw new AppError(httpStatus.CONFLICT, "Already clocked in today");
    }
    if (existing) {
      existing.clock_in = now;
      await existing.save();
      return formatAttendanceDoc(existing);
    }
    const created = await HrmAttendanceModel.create({
      employee_id: employeeId,
      shift_id: profile.shift_id,
      date: today,
      clock_in: now,
      status: "present",
      user_id: companyScope(companyId).user_id,
      creator_id: creatorObjectId(req),
      isDeleted: false,
    });
    return formatAttendanceDoc(created);
  },

  async clockOut(req: AuthRequest) {
    const companyId = resolveCompanyId(req);
    const employeeId = resolveActorUserId(req);
    const today = startOfDay(new Date());
    const row = await HrmAttendanceModel.findOne({
      ...companyScope(companyId),
      employee_id: employeeId,
      date: today,
      clock_in: { $exists: true },
    });
    if (!row) throw new AppError(httpStatus.BAD_REQUEST, "Please clock in first");
    const now = new Date();
    row.clock_out = now;
    const hours = (now.getTime() - row.clock_in.getTime()) / (1000 * 60 * 60);
    row.total_hour = Math.round(hours * 100) / 100;
    row.status = hours < 4 ? "half day" : "present";
    await row.save();
    return formatAttendanceDoc(row);
  },

  /**
   * Once per day: first hit → clock in; every later hit same day → clock out (updates checkout time).
   */
  async clockInOut(req: AuthRequest, ip?: string) {
    const companyId = resolveCompanyId(req);
    const employeeId = resolveActorUserId(req);
    const today = startOfDay(new Date());
   
    const todayRow = await HrmAttendanceModel.findOne({
      ...companyScope(companyId),
      employee_id: employeeId,
      date: today,
    }).lean();
    if (!todayRow?.clock_in) {
      return { action: "clock_in" as const, data: await this.clockIn(req, ip) };
    }
    return { action: "clock_out" as const, data: await this.clockOut(req) };
  },

  async update(req: AuthRequest, id: string, body: Record<string, unknown>) {
    const companyId = resolveCompanyId(req);
    const row = await HrmAttendanceModel.findOne({ _id: id, ...companyScope(companyId) });
    if (!row) throw new AppError(httpStatus.NOT_FOUND, "Attendance not found");
    if (body.employee_id) row.employee_id = String(body.employee_id) as never;
    if (body.shift_id) row.shift_id = body.shift_id as never;
    if (body.date) row.date = startOfDay(parseDate(body.date, "date"));
    if (body.clock_in) row.clock_in = new Date(String(body.clock_in));
    if (body.clock_out) row.clock_out = new Date(String(body.clock_out));
    if (body.status !== undefined) {
      row.status = assertEnumValue(body.status, ATTENDANCE_STATUS, "status") as never;
    }
    if (body.notes !== undefined) row.notes = String(body.notes);
    if (row.clock_in && row.clock_out) {
      const hours = (row.clock_out.getTime() - row.clock_in.getTime()) / (1000 * 60 * 60);
      row.total_hour = Math.round(hours * 100) / 100;
    }
    await row.save();
    return formatAttendanceDoc(row);
  },

  remove,

  async history(req: AuthRequest, body: Record<string, unknown>) {
    const companyId = resolveCompanyId(req);
    const employeeId = resolveActorUserId(req);
    const filter: Record<string, unknown> = {
      ...companyScope(companyId),
      employee_id: employeeId,
    };
    if (body.from_date) {
      (filter as { date?: object }).date = {
        ...(filter.date as object),
        $gte: startOfDay(parseDate(body.from_date, "from_date")),
      };
    }
    if (body.to_date) {
      (filter as { date?: object }).date = {
        ...(filter.date as object),
        $lte: startOfDay(parseDate(body.to_date, "to_date")),
      };
    }
    const rows = await HrmAttendanceModel.find(filter).sort({ date: -1 }).limit(100).lean();
    return (rows as Record<string, unknown>[]).map(formatAttendance);
  },
};
