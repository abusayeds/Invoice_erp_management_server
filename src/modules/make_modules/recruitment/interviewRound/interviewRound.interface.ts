import { Types } from "mongoose";

export type TInterviewRound = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  name: string;
  sequence_number?: number;
  description?: string;
  status: string;
  job_id?: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
