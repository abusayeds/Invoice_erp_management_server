import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { resolveCompanyId } from "../recruitment.utils";
import { recruitmentSettingService } from "./recruitmentSetting.service";
import {
  ensureOfferLetterTemplate,
  normalizeOfferLetterTemplateValue,
} from "../offer/offerLetter.template";

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

const OFFER_LETTER_PLACEHOLDERS = {
  "{applicant_name}": "Applicant Name",
  "{app_name}": "Application Name",
  "{company_name}": "Company Name",
  "{job_title}": "Job Title",
  "{job_type}": "Job Type",
  "{start_date}": "Start Date",
  "{workplace_location}": "Workplace Location",
  "{days_of_week}": "Days Of Week",
  "{salary}": "Salary",
  "{salary_type}": "Salary Type",
  "{salary_duration}": "Salary Duration",
  "{next_pay_period}": "Next Pay Period",
  "{offer_expiration_date}": "Offer Expiration Date",
  "{candidate_name}": "Candidate Name",
  "{position}": "Position",
  "{department}": "Department",
  "{bonus}": "Bonus",
  "{offer_date}": "Offer Date",
  "{expiration_date}": "Expiration Date",
};

const offerLetterTemplateGet = catchAsync(async (req: AuthRequest, res) => {
  const companyId = resolveCompanyId(req);
  const raw = await recruitmentSettingService.getValue(companyId, "offer_letter_template");
  const normalized = ensureOfferLetterTemplate(raw);

  if (!raw) {
    await recruitmentSettingService.setValue(companyId, "offer_letter_template", normalized);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offer letter template retrieved successfully",
    data: {
      content: normalized.content,
    },
  });
});

const offerLetterTemplateUpdate = catchAsync(async (req: AuthRequest, res) => {
  const companyId = resolveCompanyId(req);
  const incoming = req.body?.settings?.content
    ? req.body.settings
    : req.body?.settings?.templates?.en
      ? { content: req.body.settings.templates.en }
      : req.body?.content
        ? req.body
        : req.body?.templates?.en
          ? { content: req.body.templates.en }
          : req.body;
  const normalized = normalizeOfferLetterTemplateValue(incoming);
  const value = await recruitmentSettingService.setValue(companyId, "offer_letter_template", normalized);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offer letter template updated successfully",
    data: {
      content: value.content,
    },
  });
});

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
  offerLetterTemplateGet,
  offerLetterTemplateUpdate,
  dashboardWelcomeCardGet: makeGet("dashboard_welcome_card", "Dashboard welcome card"),
  dashboardWelcomeCardUpdate: makeUpdate("dashboard_welcome_card", "Dashboard welcome card"),
  getPlaceholders,
};
