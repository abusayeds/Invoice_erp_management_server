import { Types } from "mongoose";

export enum parentCategoryEnum {
  Fees = "Fees",
  Marketing = "Marketing",
  MealsAndEntertainment = "Meals and Entertainment",
  AdvertisingAndPromotion = "Advertising and Promotion",
  Depreciation = "Depreciation",
  Supplies = "Supplies",
  Interest = "Interest",
  Taxes = "Taxes",
  Travel = "Travel",
  Insurance = "Insurance",
  Utilities = "Utilities",
  Training = "Training",
  Maintenance = "Maintenance",
  Wages = "Wages",
}

export interface TCategory {
  _id ? : string;
  user_id? :  Types.ObjectId
  type  ? :  string
  category: string;
  parentCategory: "No Parent Category" | parentCategoryEnum;
}
