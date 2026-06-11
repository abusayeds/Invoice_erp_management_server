import { Schema, model } from "mongoose";
import { TInterview } from "./interview.interface";
import { recruitmentBaseFields } from "../recruitment.utils";

const interviewSchema = new Schema<TInterview>(
  {
    ...recruitmentBaseFields,
    scheduled_date: { type: String, required: true },
    scheduled_time: { type: String, required: true },
    duration: { type: Number },
    location: { type: String },
    meeting_link: { type: String },
    interviewer_ids: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, default: "0" },
    feedback_submitted: { type: Boolean, default: false },
    candidate_id: { type: Schema.Types.ObjectId, ref: "RecruitmentCandidate", index: true },
    job_id: { type: Schema.Types.ObjectId, ref: "RecruitmentJobPosting", index: true },
    round_id: { type: Schema.Types.ObjectId, ref: "RecruitmentInterviewRound", index: true },
    interview_type_id: { type: Schema.Types.ObjectId, ref: "RecruitmentInterviewType", index: true },
  },
  { timestamps: true }
);

export const InterviewModel = model<TInterview>("RecruitmentInterview", interviewSchema);
