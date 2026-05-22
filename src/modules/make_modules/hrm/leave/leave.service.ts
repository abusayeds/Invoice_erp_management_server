import httpStatus from "http-status";
import AppError from "../../../../errors/AppError";
import queryBuilder from "../../../../builder/queryBuilder";
import { HrmLeaveApplicationModel, HrmLeaveTypeModel } from "../models";
import {
  applyOwnershipToQuery,
  assertPermission,
  companyScope,
  creatorObjectId,
  parseDate,
  resolveActorUserId,
  resolveCompanyId,
  resolveOwnership,
} from "../shared/hrm.utils";
import { AuthRequest } from "../../../../middlewares/auth";
import { getHrmCompanySettings } from "../shared/hrm.settings.service";

const diffDays = (start: Date, end: Date) => {
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
};

const lean = (d: Record<string, unknown>) => ({ ...d, _id: d._id ? String(d._id) : undefined });

export const leaveService = {
  async list(req: AuthRequest, query: Record<string, unknown>) {
    assertPermission(req, "manage-leave-applications");
    const companyId = resolveCompanyId(req);
    const ownership = resolveOwnership(req, "manage-any-leave-applications", "manage-own-leave-applications");
    const base = applyOwnershipToQuery(companyScope(companyId), ownership, { employeeField: true });
    let mq = HrmLeaveApplicationModel.find(base)
      .populate("employee_id", "name email image")
      .populate("leave_type_id", "name color is_paid");
    const qb = new queryBuilder(mq, query).search(["reason"]).filter().sort().fields();
    const { totalData } = await qb.paginate(HrmLeaveApplicationModel.find(base));
    const rows = await qb.modelQuery.exec();
    const data = (rows as unknown as Record<string, unknown>[]).map(lean);
    const pagination = qb.calculatePagination({
      totalData,
      currentPage: Number(query?.page) || 1,
      limit: Number(query?.limit) || 10,
    });
    return { data, pagination };
  },

  async create(req: AuthRequest, body: Record<string, unknown>) {
    assertPermission(req, "create-leave-applications");
    const companyId = resolveCompanyId(req);
    const employee_id = body.employee_id ? String(body.employee_id) : resolveActorUserId(req);
    const start = parseDate(body.start_date, "start_date");
    const end = parseDate(body.end_date, "end_date");
    if (end < start) throw new AppError(httpStatus.BAD_REQUEST, "end_date must be on or after start_date");
    const doc = await HrmLeaveApplicationModel.create({
      employee_id,
      leave_type_id: body.leave_type_id,
      start_date: start,
      end_date: end,
      total_days: diffDays(start, end),
      reason: String(body.reason ?? ""),
      attachment: body.attachment,
      status: "pending",
      user_id: companyScope(companyId).user_id,
      creator_id: creatorObjectId(req),
      isDeleted: false,
    });
    return lean(doc.toObject() as unknown as Record<string, unknown>);
  },

  async updateStatus(req: AuthRequest, id: string, body: Record<string, unknown>) {
    assertPermission(req, "manage-leave-status");
    const companyId = resolveCompanyId(req);
    const status = body.status as "approved" | "rejected" | "pending";
    if (!["approved", "rejected", "pending"].includes(status)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid status");
    }
    const updated = await HrmLeaveApplicationModel.findOneAndUpdate(
      { _id: id, ...companyScope(companyId) },
      {
        $set: {
          status,
          approver_comment: body.approver_comment,
          approved_by: creatorObjectId(req),
          approved_at: new Date(),
        },
      },
      { new: true }
    ).lean();
    if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Leave application not found");
    return lean(updated as Record<string, unknown>);
  },

  async balance(req: AuthRequest, employeeUserId: string, leaveTypeId: string) {
    assertPermission(req, "manage-leave-balance");
    const companyId = resolveCompanyId(req);
    const leaveType = await HrmLeaveTypeModel.findOne({ _id: leaveTypeId, ...companyScope(companyId) }).lean();
    if (!leaveType) throw new AppError(httpStatus.NOT_FOUND, "Leave type not found");
    const max = leaveType.max_days_per_year ?? 0;
    const year = new Date().getFullYear();
    const used = await HrmLeaveApplicationModel.aggregate([
      {
        $match: {
          user_id: companyScope(companyId).user_id,
          employee_id: employeeUserId,
          leave_type_id: leaveType._id,
          status: "approved",
          isDeleted: false,
          start_date: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
        },
      },
      { $group: { _id: null, total: { $sum: "$total_days" } } },
    ]);
    const usedDays = used[0]?.total ?? 0;
    return {
      leave_type_id: String(leaveType._id),
      max_days_per_year: max,
      used_days: usedDays,
      balance: Math.max(0, max - usedDays),
    };
  },

  async balanceReport(req: AuthRequest, query: Record<string, unknown>) {
    assertPermission(req, "manage-leave-balance");
    const companyId = resolveCompanyId(req);
    const types = await HrmLeaveTypeModel.find(companyScope(companyId)).lean();
    if (!query.employee_id) {
      return { leave_types: types, note: "Pass employee_id query for per-employee balance" };
    }
    const employeeUserId = String(query.employee_id);
    const rows = [];
    for (const lt of types) {
      const max = lt.max_days_per_year ?? 0;
      const year = new Date().getFullYear();
      const used = await HrmLeaveApplicationModel.aggregate([
        {
          $match: {
            user_id: companyScope(companyId).user_id,
            employee_id: employeeUserId,
            leave_type_id: lt._id,
            status: "approved",
            isDeleted: false,
            start_date: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
          },
        },
        { $group: { _id: null, total: { $sum: "$total_days" } } },
      ]);
      const usedDays = used[0]?.total ?? 0;
      rows.push({
        leave_type: lt,
        max_days_per_year: max,
        used_days: usedDays,
        balance: Math.max(0, max - usedDays),
      });
    }
    return { employee_id: employeeUserId, balances: rows };
  },

  async leaveTypesForEmployee(req: AuthRequest, employeeUserId: string) {
    const companyId = resolveCompanyId(req);
    return HrmLeaveTypeModel.find(companyScope(companyId)).lean();
  },

  async update(req: AuthRequest, id: string, body: Record<string, unknown>) {
    assertPermission(req, "edit-leave-applications");
    const companyId = resolveCompanyId(req);
    const existing = await HrmLeaveApplicationModel.findOne({ _id: id, ...companyScope(companyId) });
    if (!existing) throw new AppError(httpStatus.NOT_FOUND, "Leave application not found");
    const patch: Record<string, unknown> = {};
    if (body.leave_type_id) patch.leave_type_id = body.leave_type_id;
    if (body.reason !== undefined) patch.reason = body.reason;
    if (body.attachment !== undefined) patch.attachment = body.attachment;
    if (body.start_date || body.end_date) {
      const start = body.start_date ? parseDate(body.start_date, "start_date") : existing.start_date!;
      const end = body.end_date ? parseDate(body.end_date, "end_date") : existing.end_date!;
      if (end < start) throw new AppError(httpStatus.BAD_REQUEST, "end_date must be on or after start_date");
      patch.start_date = start;
      patch.end_date = end;
      patch.total_days = diffDays(start, end);
    }
    const updated = await HrmLeaveApplicationModel.findOneAndUpdate(
      { _id: id, ...companyScope(companyId) },
      { $set: patch },
      { new: true }
    ).lean();
    return lean(updated as Record<string, unknown>);
  },

  async remove(req: AuthRequest, id: string) {
    assertPermission(req, "delete-leave-applications");
    const companyId = resolveCompanyId(req);
    const updated = await HrmLeaveApplicationModel.findOneAndUpdate(
      { _id: id, ...companyScope(companyId) },
      { isDeleted: true },
      { new: true }
    );
    if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Leave application not found");
    return { _id: id };
  },
};
