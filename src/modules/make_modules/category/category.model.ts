import { Schema, model } from "mongoose";
import { TCategory, parentCategoryEnum } from "./category.interface";
import { number } from "zod";

const categorySchema = new Schema<TCategory>(
  {
    user_id :  {
       type :  Schema.Types.ObjectId ,
       required :  true  , 
       ref :  "User"
    } ,
    type: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    parentCategory: {
      type: String,
      enum: ["No Parent Category", ...Object.values(parentCategoryEnum)],
      default: "No Parent Category",
    },
   
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = model<TCategory>(
  "Category",
  categorySchema
);