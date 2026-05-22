import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { masterServices, MasterResourceKey } from "./master.registry";
import { assertPermission, resolveCompanyId } from "../shared/hrm.utils";
import { getHrmCompanySettings, toggleIpRestrict, updateWorkingDays } from "../shared/hrm.settings.service";
import AppError from "../../../../errors/AppError";
import { sendHrmPaginatedList } from "../shared/hrm.response";

const getService = (resource: string) => {
  const svc = masterServices[resource as MasterResourceKey];
  if (!svc) throw new AppError(httpStatus.NOT_FOUND, `Unknown HRM resource: ${resource}`);
  return svc;
};

const list = (resource: string) =>
  catchAsync(async (req: AuthRequest, res) => {
    const result = await getService(resource).list(req, req.query as Record<string, unknown>);
    sendHrmPaginatedList(res, "List retrieved", result);
  });

const get = (resource: string) =>
  catchAsync(async (req: AuthRequest, res) => {
    const data = await getService(resource).get(req, req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Record retrieved", data });
  });

const create = (resource: string) =>
  catchAsync(async (req: AuthRequest, res) => {
    const data = await getService(resource).create(req, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Created successfully", data });
  });

const update = (resource: string) =>
  catchAsync(async (req: AuthRequest, res) => {
    const data = await getService(resource).update(req, req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Updated successfully", data });
  });

const remove = (resource: string) =>
  catchAsync(async (req: AuthRequest, res) => {
    const data = await getService(resource).remove(req, req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Deleted successfully", data });
  });

export const masterController = { list, get, create, update, remove };

export const workingDaysGet = catchAsync(async (req: AuthRequest, res) => {
  assertPermission(req, "manage-working-days");
  const data = await getHrmCompanySettings(resolveCompanyId(req));
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Working days", data });
});

export const workingDaysUpdate = catchAsync(async (req: AuthRequest, res) => {
  assertPermission(req, "edit-working-days");
  const companyId = resolveCompanyId(req);
  await updateWorkingDays(companyId, req.body.working_days);
  const data = await getHrmCompanySettings(companyId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Working days updated", data });
});

export const ipRestrictToggle = catchAsync(async (req: AuthRequest, res) => {
  assertPermission(req, "manage-ip-restricts");
  const companyId = resolveCompanyId(req);
  await toggleIpRestrict(companyId, Boolean(req.body.enabled));
  const data = await getHrmCompanySettings(companyId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "IP restrict setting updated", data });
});
