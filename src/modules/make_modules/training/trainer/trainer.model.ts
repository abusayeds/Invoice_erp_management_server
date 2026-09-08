import { Schema, model } from "mongoose";
import { TTrainer } from "./trainer.interface";
import { trainingBaseFields } from "../training.utils";

const trainerSchema = new Schema<TTrainer>(
  {
    ...trainingBaseFields,
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    experience: { type: String, required: true, trim: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "HrmBranch", required: true },
    department_id: { type: Schema.Types.ObjectId, ref: "HrmDepartment", required: true },
    expertise: { type: String },
    qualification: { type: String },
  },
  { timestamps: true }
);

export const TrainerModel = model<TTrainer>("Trainer", trainerSchema);
