import { Schema, model } from "mongoose";
import { TTrainingType } from "./trainingType.interface";
import { trainingBaseFields } from "../training.utils";

const trainingTypeSchema = new Schema<TTrainingType>(
  {
    ...trainingBaseFields,
    name: { type: String, required: true, trim: true },
    description: { type: String },
    branch_id: { type: Schema.Types.ObjectId, ref: "HrmBranch", required: true },
    department_id: { type: Schema.Types.ObjectId, ref: "HrmDepartment", required: true },
  },
  { timestamps: true }
);

export const TrainingTypeModel = model<TTrainingType>("TrainingType", trainingTypeSchema);
