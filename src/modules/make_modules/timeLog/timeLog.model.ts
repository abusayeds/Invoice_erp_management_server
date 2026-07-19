import { Schema, model, Types } from "mongoose";

export interface TTimeLog {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  creator_id?: Types.ObjectId;
  date?: Date;
  details?: string;
  // Project / task are free-text from the app form (users may type a name).
  project_id?: Types.ObjectId;
  project_name?: string;
  task_id?: Types.ObjectId;
  task_name?: string;
  notes?: string;
  hours?: number;
  is_active?: boolean;
  isDeleted?: boolean;
}

const timeLogSchema = new Schema<TTimeLog>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date },
    details: { type: String },
    project_id: { type: Schema.Types.ObjectId, ref: "Project" },
    project_name: { type: String },
    task_id: { type: Schema.Types.ObjectId },
    task_name: { type: String },
    notes: { type: String },
    hours: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const TimeLogModel = model<TTimeLog>("TimeLog", timeLogSchema);
