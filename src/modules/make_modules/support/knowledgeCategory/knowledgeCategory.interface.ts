import { Types } from "mongoose";

export interface TKnowledgeCategory {
  _id?: string;
  user_id?: Types.ObjectId;
  title: string;
  isDeleted?: boolean;
}
