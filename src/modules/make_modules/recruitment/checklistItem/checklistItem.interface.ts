import { Types } from "mongoose";

export type TChecklistItem = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  task_name: string;
  description?: string;
  category?: string;
  assigned_to_role?: string;
  due_day?: number;
  is_required: boolean;
  status: boolean;
  checklist_id: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
