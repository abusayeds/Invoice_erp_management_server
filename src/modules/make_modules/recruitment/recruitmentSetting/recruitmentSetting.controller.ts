import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { resolveCompanyId } from "../recruitment.utils";
import { recruitmentSettingService } from "./recruitmentSetting.service";

const makeGet = (key: string, label: string) =>
  catchAsync(async (req: AuthRequest, res) => {
    const value = await recruitmentSettingService.getValue(resolveCompanyId(req), key);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: `${label} retrieved successfully`, data: value });
  });

const makeUpdate = (key: string, label: string) =>
  catchAsync(async (req: AuthRequest, res) => {
    const value = await recruitmentSettingService.setValue(resolveCompanyId(req), key, req.body);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: `${label} updated successfully`, data: value });
  });

const OFFER_LETTER_PLACEHOLDERS = [
  "{candidate_name}",
  "{position}",
  "{department}",
  "{salary}",
  "{bonus}",
  "{start_date}",
  "{offer_date}",
  "{expiration_date}",
  "{company_name}",
];

const getPlaceholders = catchAsync(async (_req: AuthRequest, res) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offer letter placeholders retrieved successfully",
    data: { placeholders: OFFER_LETTER_PLACEHOLDERS },
  });
});

export const recruitmentSettingController = {
  aboutCompanyGet: makeGet("about_company", "About company"),
  aboutCompanyUpdate: makeUpdate("about_company", "About company"),
  applicationTipsGet: makeGet("application_tips", "Application tips"),
  applicationTipsUpdate: makeUpdate("application_tips", "Application tips"),
  whatHappensNextGet: makeGet("what_happens_next", "What happens next"),
  whatHappensNextUpdate: makeUpdate("what_happens_next", "What happens next"),
  needHelpGet: makeGet("need_help", "Need help"),
  needHelpUpdate: makeUpdate("need_help", "Need help"),
  trackingFaqGet: makeGet("tracking_faq", "Tracking FAQ"),
  trackingFaqUpdate: makeUpdate("tracking_faq", "Tracking FAQ"),
  offerLetterTemplateGet: makeGet("offer_letter_template", "Offer letter template"),
  offerLetterTemplateUpdate: makeUpdate("offer_letter_template", "Offer letter template"),
  dashboardWelcomeCardGet: makeGet("dashboard_welcome_card", "Dashboard welcome card"),
  dashboardWelcomeCardUpdate: makeUpdate("dashboard_welcome_card", "Dashboard welcome card"),
  getPlaceholders,
};
