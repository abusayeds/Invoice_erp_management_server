import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import { InterviewRoundModel } from "./interviewRound.model";
import { TInterviewRound } from "./interviewRound.interface";

const P = permission.recruitment.interview_rounds;

export const interviewRoundService = createRecruitmentCrudService<TInterviewRound>({
  model: InterviewRoundModel,
  label: "Interview round",
  perms: { manageAny: P.manage_any_interview_rounds, manageOwn: P.manage_own_interview_rounds },
  searchFields: ["name", "description"],
  formatItem: (d) => ({
    _id: d._id,
    name: d.name,
    sequence_number: d.sequence_number ?? null,
    description: d.description ?? null,
    status: d.status,
    job_id: d.job_id ?? null,
    createdAt: d.createdAt,
  }),
});
