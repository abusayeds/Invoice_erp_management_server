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
  assertPermission,
  companyScope,
  creatorObjectId,
  hasPermission,
  parseDate,
  resolveActorUserId,
  resolveCompanyId,
  resolveOwnership,
} from "../shared/hrm.utils";
import { AuthRequest } from "../../../../middlewares/auth";
import { getHrmCompanySettings } from "../shared/hrm.settings.service";

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const validateAttendanceDay = async (companyId: string, employeeUserId: string, date: Date) => {
  const settings = await getHrmCompanySettings(companyId);
  const dayIndex = date.getDay();
  if (!settings.working_days.includes(dayIndex)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Attendance cannot be created for non-working days");
  }
  const onLeave = await HrmLeaveApplicationModel.exists({
    ...companyScope(companyId),
    employee_id: employeeUserId,
    status: "approved",
    start_date: { $lte: date },
    end_date: { $gte: date },
  });
  if (onLeave) throw new AppError(httpStatus.BAD_REQUEST, "Employee is on leave for this date");
  const holiday = await HrmHolidayModel.exists({
    ...companyScope(companyId),
    start_date: { $lte: date },
    end_date: { $gte: date },
  });
  if (holiday) throw new AppError(httpStatus.BAD_REQUEST, "Attendance cannot be created on holidays");
};

export const attendanceService = {
  async list(req: AuthRequest, query: Record<string, unknown>) {
    assertPermission(req, "manage-attendances");
    const companyId = resolveCompanyId(req);
    const ownership = resolveOwnership(req, "manage-any-attendances", "manage-own-attendances");
    const base = applyOwnershipToQuery(companyScope(companyId), ownership, { employeeField: true });
    if (query.employee_id) (base as Record<string, unknown>).employee_id = query.employee_id;
    let mq = HrmAttendanceModel.find(base).populate("employee_id", "name email").populate("shift_id", "shift_name");
    const qb = new queryBuilder(mq, query).filter().sort().fields();
    const { totalData } = await qb.paginate(HrmAttendanceModel.find(base));
    const data = await qb.modelQuery.exec();
    const pagination = qb.calculatePagination({
      totalData,
      currentPage: Number(query?.page) || 1,
      limit: Number(query?.limit) || 10,
    });
    return { data, pagination };
  },

  async createManual(req: AuthRequest, body: Record<string, unknown>) {
    assertPermission(req, "create-attendances");
    const companyId = resolveCompanyId(req);
    const employee_id = String(body.employee_id);
    const date = startOfDay(parseDate(body.date, "date"));
    const exists = await HrmAttendanceModel.exists({
      ...companyScope(companyId),
      employee_id,
      date,
    });
    if (exists) throw new AppError(httpStatus.CONFLICT, "Attendance already exists for this date");
    await validateAttendanceDay(companyId, employee_id, date);
    const doc = await HrmAttendanceModel.create({
      employee_id,
      shift_id: body.shift_id,
      date,
      clock_in: body.clock_in ? new Date(String(body.clock_in)) : new Date(),
      clock_out: body.clock_out ? new Date(String(body.clock_out)) : undefined,
      status: body.status ?? "present",
      notes: body.notes,
      user_id: companyScope(companyId).user_id,
      creator_id: creatorObjectId(req),
      isDeleted: false,
    });
    return doc;
  },

  async clockStatus(req: AuthRequest) {
    const companyId = resolveCompanyId(req);
    const employeeId = resolveActorUserId(req);
    const today = startOfDay(new Date());
    const todayRow = await HrmAttendanceModel.findOne({
      ...companyScope(companyId),
      employee_id: employeeId,
      date: today,
    }).lean();
    const pending = await HrmAttendanceModel.findOne({
      ...companyScope(companyId),
      employee_id: employeeId,
      clock_out: { $exists: false },
      clock_in: { $exists: true },
    })
      .sort({ clock_in: -1 })
      .lean();
    return {
      can_clock_in: !todayRow?.clock_in || Boolean(todayRow?.clock_out),
      can_clock_out: Boolean(pending && !pending.clock_out),
      today_attendance: todayRow,
      pending_clock_out: pending,
    };
  },

  async clockIn(req: AuthRequest, ip?: string) {
    assertPermission(req, "clock-in");
    const companyId = resolveCompanyId(req);
    const employeeId = resolveActorUserId(req);
    const settings = await getHrmCompanySettings(companyId);
    if (settings.ip_restrict === "on" && ip) {
      const allowed = await HrmIpRestrictModel.exists({ ...companyScope(companyId), ip });
      if (!allowed) throw new AppError(httpStatus.FORBIDDEN, "This IP is not allowed to clock in & clock out");
    }
    const today = startOfDay(new Date());
    await validateAttendanceDay(companyId, employeeId, today);
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
    });
    if (open) throw new AppError(httpStatus.CONFLICT, "Please clock out from pending attendance first");
    const existing = await HrmAttendanceModel.findOne({
      ...companyScope(companyId),
      employee_id: employeeId,
      date: today,
    });
    if (existing?.clock_in && !existing.clock_out) {
      throw new AppError(httpStatus.CONFLICT, "Already clocked in today");
    }
    const now = new Date();
    if (existing) {
      existing.clock_in = now;
      existing.clock_out = undefined;
      await existing.save();
      return existing;
    }
    return HrmAttendanceModel.create({
      employee_id: employeeId,
      shift_id: profile.shift_id,
      date: today,
      clock_in: now,
      status: "present",
      user_id: companyScope(companyId).user_id,
      creator_id: creatorObjectId(req),
      isDeleted: false,
    });
  },

  async clockOut(req: AuthRequest) {
    assertPermission(req, "clock-out");
    const companyId = resolveCompanyId(req);
    const employeeId = resolveActorUserId(req);
    const row = await HrmAttendanceModel.findOne({
      ...companyScope(companyId),
      employee_id: employeeId,
      clock_out: { $exists: false },
      clock_in: { $exists: true },
    }).sort({ clock_in: -1 });
    if (!row) throw new AppError(httpStatus.BAD_REQUEST, "No active clock-in found");
    const now = new Date();
    row.clock_out = now;
    const hours = (now.getTime() - row.clock_in.getTime()) / (1000 * 60 * 60);
    row.total_hour = Math.round(hours * 100) / 100;
    row.status = hours < 4 ? "half day" : "present";
    await row.save();
    return row;
  },

  async clockInOut(req: AuthRequest, type: "clockin" | "clockout", ip?: string) {
    if (type === "clockin") return this.clockIn(req, ip);
    return this.clockOut(req);
  },

  async update(req: AuthRequest, id: string, body: Record<string, unknown>) {
    assertPermission(req, "edit-attendances");
    const companyId = resolveCompanyId(req);
    const row = await HrmAttendanceModel.findOne({ _id: id, ...companyScope(companyId) });
    if (!row) throw new AppError(httpStatus.NOT_FOUND, "Attendance not found");
    if (body.employee_id) row.employee_id = String(body.employee_id) as never;
    if (body.shift_id) row.shift_id = body.shift_id as never;
    if (body.date) row.date = startOfDay(parseDate(body.date, "date"));
    if (body.clock_in) row.clock_in = new Date(String(body.clock_in));
    if (body.clock_out) row.clock_out = new Date(String(body.clock_out));
    if (body.status) row.status = body.status as never;
    if (body.notes !== undefined) row.notes = String(body.notes);
    if (row.clock_in && row.clock_out) {
      const hours = (row.clock_out.getTime() - row.clock_in.getTime()) / (1000 * 60 * 60);
      row.total_hour = Math.round(hours * 100) / 100;
    }
    await row.save();
    return row;
  },

  async remove(req: AuthRequest, id: string) {
    assertPermission(req, "delete-attendances");
    const companyId = resolveCompanyId(req);
    const updated = await HrmAttendanceModel.findOneAndUpdate(
      { _id: id, ...companyScope(companyId) },
      { isDeleted: true },
      { new: true }
    );
    if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Attendance not found");
    return { _id: id };
  },

  async history(req: AuthRequest, body: Record<string, unknown>) {
    assertPermission(req, "manage-own-attendances");
    const companyId = resolveCompanyId(req);
    const employeeId = resolveActorUserId(req);
    const filter: Record<string, unknown> = {
      ...companyScope(companyId),
      employee_id: employeeId,
    };
    if (body.from_date) (filter as { date?: object }).date = { ...(filter.date as object), $gte: parseDate(body.from_date) };
    if (body.to_date) (filter as { date?: object }).date = { ...(filter.date as object), $lte: parseDate(body.to_date) };
    return HrmAttendanceModel.find(filter).sort({ date: -1 }).limit(100).lean();
  },
};
