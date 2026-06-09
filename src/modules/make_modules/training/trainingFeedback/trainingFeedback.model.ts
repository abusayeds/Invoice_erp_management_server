import { Schema, model } from "mongoose";
import { TTrainingFeedback } from "./trainingFeedback.interface";
import { trainingBaseFields } from "../training.utils";

const trainingFeedbackSchema = new Schema<TTrainingFeedback>(
  {
    ...trainingBaseFields,
    training_task_id: { type: Schema.Types.ObjectId, ref: "TrainingTask", required: true, index: true },
    employee_user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: 1, min: 1, max: 5 },
    comments: { type: String },
  },
  { timestamps: true }
);

export const TrainingFeedbackModel = model<TTrainingFeedback>(
  "TrainingFeedback",
  trainingFeedbackSchema
);
