import { Schema, model } from "mongoose";
import { TTrainingTask } from "./trainingTask.interface";
import { trainingBaseFields } from "../training.utils";

const trainingTaskSchema = new Schema<TTrainingTask>(
  {
    ...trainingBaseFields,
    training_id: { type: Schema.Types.ObjectId, ref: "Training", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    due_date: { type: Date },
    assigned_to: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const TrainingTaskModel = model<TTrainingTask>("TrainingTask", trainingTaskSchema);
