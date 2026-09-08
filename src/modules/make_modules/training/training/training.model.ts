import { Schema, model } from "mongoose";
import { TTraining } from "./training.interface";
import { trainingBaseFields } from "../training.utils";

const trainingSchema = new Schema<TTraining>(
  {
    ...trainingBaseFields,
    title: { type: String, required: true, trim: true },
    description: { type: String },
    training_type_id: { type: Schema.Types.ObjectId, ref: "TrainingType", required: true },
    trainer_id: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "HrmBranch", required: true },
    department_id: { type: Schema.Types.ObjectId, ref: "HrmDepartment", required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    location: { type: String },
    max_participants: { type: Number },
    cost: { type: Number },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export const TrainingModel = model<TTraining>("Training", trainingSchema);
