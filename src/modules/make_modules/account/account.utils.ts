import { Model, Types } from "mongoose";
import { AuthRequest } from "../../../middlewares/auth";

export const applyCompanyUserToBody = (req: AuthRequest) => {
  if (req.user?._id) {
    req.body.user_id = req.user._id;
  }
};

export const companyObjectId = (userId: string | Types.ObjectId) =>
  userId instanceof Types.ObjectId ? userId : new Types.ObjectId(String(userId));

export const creatorId = (req: AuthRequest) =>
  req.user?._id ? companyObjectId(String(req.user._id)) : undefined;

export const companyScope = (userId: string | Types.ObjectId) => ({
  user_id: companyObjectId(userId),
  isDeleted: false,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateAccountNumber = async (
  Model: Model<any>,
  prefix: string,
  userId: Types.ObjectId,
  field = "payment_number"
) => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const pattern = new RegExp(`^${prefix}-${year}-${month}-`);
  const last = await Model.findOne({
    user_id: userId,
    [field]: { $regex: pattern },
    isDeleted: { $ne: true },
  })
    .sort({ [field]: -1 })
    .lean()
    .exec();
  let next = 1;
  const lastVal = last ? (last as Record<string, unknown>)[field] : undefined;
  if (lastVal) {
    const parts = String(lastVal).split("-");
    next = parseInt(parts[parts.length - 1], 10) + 1;
  }
  return `${prefix}-${year}-${month}-${String(next).padStart(3, "0")}`;
};

export const parseNormalBalance = (value: unknown): "credit" | "debit" => {
  if (value === "credit" || value === 1 || value === "1") return "credit";
  if (value === "debit" || value === 0 || value === "0" || value === 2 || value === "2") {
    return "debit";
  }
  throw new Error("normal_balance must be credit, debit, 0, 1, or 2");
};
