import { Schema, model, Types } from "mongoose";

export type TRecruitmentSetting = {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  createdAt?: Date;
  updatedAt?: Date;
};

const recruitmentSettingSchema = new Schema<TRecruitmentSetting>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    key: { type: String, required: true },
    value: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);
recruitmentSettingSchema.index({ user_id: 1, key: 1 }, { unique: true });

export const RecruitmentSettingModel = model<TRecruitmentSetting>(
  "RecruitmentSetting",
  recruitmentSettingSchema
);
