import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import { InterviewFeedbackModel } from "./interviewFeedback.model";
import { TInterviewFeedback } from "./interviewFeedback.interface";

const P = permission.recruitment.interview_feedbacks;

export const interviewFeedbackService = createRecruitmentCrudService<TInterviewFeedback>({
  model: InterviewFeedbackModel,
  label: "Interview feedback",
  perms: { manageAny: P.manage_any_interview_feedbacks, manageOwn: P.manage_own_interview_feedbacks },
  searchFields: ["strengths", "weaknesses", "comments"],
  formatItem: (d) => ({
    _id: d._id,
    technical_rating: d.technical_rating ?? null,
    communication_rating: d.communication_rating ?? null,
    cultural_fit_rating: d.cultural_fit_rating ?? null,
    overall_rating: d.overall_rating ?? null,
    strengths: d.strengths ?? null,
    weaknesses: d.weaknesses ?? null,
    comments: d.comments ?? null,
    recommendation: d.recommendation,
    interview_id: d.interview_id ?? null,
    interviewer_ids: d.interviewer_ids ?? [],
    createdAt: d.createdAt,
  }),
});
