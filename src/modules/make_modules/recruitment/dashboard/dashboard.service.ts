import { FilterQuery } from "mongoose";
import { AuthRequest } from "../../../../middlewares/auth";
import { companyScope, resolveCompanyId } from "../recruitment.utils";
import { CandidateModel } from "../candidate/candidate.model";
import { JobPostingModel } from "../jobPosting/jobPosting.model";
import { InterviewModel } from "../interview/interview.model";
import { CandidateOnboardingModel } from "../candidateOnboarding/candidateOnboarding.model";

const getDashboard = async (req: AuthRequest) => {
  const companyId = resolveCompanyId(req);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scope = companyScope(companyId) as FilterQuery<any>;

  const [
    totalCandidates,
    activeJobPostings,
    pendingInterviews,
    completedOnboardings,
    applied,
    shortlisted,
    interviewScheduled,
    hired,
    rejected,
    onbPending,
    onbInProgress,
    onbCompleted,
    latestCandidates,
  ] = await Promise.all([
    CandidateModel.countDocuments(scope),
    JobPostingModel.countDocuments({ ...scope, is_published: true }),
    InterviewModel.countDocuments({ ...scope, status: "0" }),
    CandidateOnboardingModel.countDocuments({ ...scope, status: "Completed" }),
    CandidateModel.countDocuments({ ...scope, status: "0" }),
    CandidateModel.countDocuments({ ...scope, status: "1" }),
    CandidateModel.countDocuments({ ...scope, status: "2" }),
    CandidateModel.countDocuments({ ...scope, status: "4" }),
    CandidateModel.countDocuments({ ...scope, status: "5" }),
    CandidateOnboardingModel.countDocuments({ ...scope, status: "Pending" }),
    CandidateOnboardingModel.countDocuments({ ...scope, status: "In Progress" }),
    CandidateOnboardingModel.countDocuments({ ...scope, status: "Completed" }),
    CandidateModel.find(scope)
      .sort({ createdAt: -1 })
      .limit(5)
      .select("first_name last_name email status tracking_id createdAt"),
  ]);

  return {
    stats: { totalCandidates, activeJobPostings, pendingInterviews, completedOnboardings },
    candidatePipeline: { applied, shortlisted, interviewScheduled, hired, rejected },
    onboarding: { pending: onbPending, inProgress: onbInProgress, completed: onbCompleted },
    latestCandidates,
  };
};

export const recruitmentDashboardService = { getDashboard };
