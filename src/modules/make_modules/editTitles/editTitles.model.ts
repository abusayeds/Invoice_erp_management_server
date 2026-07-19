import { Schema, Types, model } from "mongoose";

export type Title = {
  name: string;
};

export type TEditTitles = {
  user_id: Types.ObjectId;
  titles: Title[];
};
const seedEditSchema = new Schema<TEditTitles>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    titles: [
      {
        name: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const EditTitleModel = model<TEditTitles>("EditTitle", seedEditSchema);
