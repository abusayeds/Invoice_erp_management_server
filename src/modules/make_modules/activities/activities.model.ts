import { Schema, model } from "mongoose";
import { ActivitiesType, TActivities } from "./activities.interface";

const activitiesSchema = new Schema<TActivities>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(ActivitiesType),
      required: true,
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const ActivitiesModel = model<TActivities>("Activities", activitiesSchema);

export default ActivitiesModel;
