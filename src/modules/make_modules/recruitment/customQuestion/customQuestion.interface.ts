import { Types } from "mongoose";

export const customQuestionTypes = ["text", "textarea", "select", "radio", "checkbox", "date", "number"] as const;
export type TCustomQuestionType = (typeof customQuestionTypes)[number];

export type TCustomQuestion = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  question: string;
  type: TCustomQuestionType;
  options?: string[];
  is_required: boolean;
  is_active: boolean;
  sort_order?: number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
