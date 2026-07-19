import {
  HrmAttendanceModel,
  HrmBranchModel,
  HrmDepartmentModel,
  HrmEmployeeModel,
  HrmEventModel,
  HrmHolidayModel,
  HrmLeaveApplicationModel,
  HrmPromotionModel,
  HrmTerminationModel,
} from "../models";
import {
  companyScope,
  isCompanyOrHr,
  isEmployeeRole,
  resolveActorUserId,
  resolveCompanyId,
  spansCalendarDay,
} from "../shared/hrm.utils";
import { AuthRequest } from "../../../../middlewares/auth";
import { attendanceService } from "../attendance/attendance.service";

const todayRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  return { today, end };
};

export const hrmDashboardService = {
  async home(req: AuthRequest) {
    const companyId = resolveCompanyId(req);
    const scope = companyScope(companyId);
    const { today, end } = todayRange();

    if (isEmployeeRole(req.user!) && !isCompanyOrHr(req.user!)) {
      const employeeId = resolveActorUserId(req);
      const clock = await attendanceService.clockStatus(req);
      const onLeave = await HrmLeaveApplicationModel.find({
        ...scope,
        employee_id: employeeId,
        status: "approved",
        ...spansCalendarDay(today),
      }).lean();
      const announcements = await HrmEventModel.find({ ...scope, status: "approved" }).limit(5).lean();
      return { view: "employee", clock, on_leave: onLeave, events: announcements };
    }

    const totalEmployees = await HrmEmployeeModel.countDocuments(scope);
    const presentToday = await HrmAttendanceModel.countDocuments({
      ...scope,
      date: { $gte: today, $lte: end },
      clock_in: { $exists: true },
    });
    const absentToday = await HrmAttendanceModel.countDocuments({
      ...scope,
      date: { $gte: today, $lte: end },
      status: "absent",
    });
    const onLeave = await HrmLeaveApplicationModel.countDocuments({
      ...scope,
      status: "approved",
      ...spansCalendarDay(today),
    });
    const pendingLeaves = await HrmLeaveApplicationModel.countDocuments({
      ...scope,
      status: "pending",
    });
    const totalBranches = await HrmBranchModel.countDocuments(scope);
    const totalDepartments = await HrmDepartmentModel.countDocuments(scope);
    const promotionsThisMonth = await HrmPromotionModel.countDocuments({
      ...scope,
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), 1),
      },
    });
    const terminationsThisMonth = await HrmTerminationModel.countDocuments({
      ...scope,
      status: "approved",
      createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) },
    });

    const events = await HrmEventModel.find({ ...scope, status: "approved" }).limit(20).lean();
    const holidays = await HrmHolidayModel.find({
      ...scope,
      end_date: { $gte: today },
    })
      .limit(20)
      .lean();

    return {
      view: "company",
      stats: {
        total_employees: totalEmployees,
        present_today: presentToday,
        absent_today: absentToday,
        on_leave: onLeave,
        pending_leaves: pendingLeaves,
        total_branches: totalBranches,
        total_departments: totalDepartments,
        promotions_this_month: promotionsThisMonth,
        terminations_this_month: terminationsThisMonth,
      },
      calendar: { events, holidays },
    };
  },

  async events(req: AuthRequest, body: Record<string, unknown>) {
    const companyId = resolveCompanyId(req);
    const scope = companyScope(companyId);
    const filter: Record<string, unknown> = { ...scope };
    if (body.from_date || body.to_date) {
      filter.start_date = {};
      if (body.from_date) (filter.start_date as { $gte?: Date }).$gte = new Date(String(body.from_date));
      if (body.to_date) (filter.start_date as { $lte?: Date }).$lte = new Date(String(body.to_date));
    }
    return HrmEventModel.find(filter).populate("event_type_id").lean();
  },
};
