import httpStatus from "http-status";
import { TTerms } from "./terms.interface";
import AppError from "../../../errors/AppError";
import { TermsOfUseModel } from "./terms.model";

const createTerms = async (payload: TTerms) => {
    const existing = await TermsOfUseModel.findOne();
    if (existing) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Terms already exists. Use update instead."
      );
    }
  const result = await TermsOfUseModel.create(payload);
  return result;
};

const getTerms = async () => {
  const result = await TermsOfUseModel.findOne();
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Terms not found.");
  }
  return result;
};

const updateTerms = async (payload: Partial<TTerms>) => {
  const existing = await TermsOfUseModel.findOne();
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Terms not found.");
  }
  const result = await TermsOfUseModel.findOneAndUpdate(
    {},
    { $set: payload },
    { new: true, runValidators: true },
  );
  return result;
};

const deleteTerms = async () => {
  const existing = await TermsOfUseModel.findOne();
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Terms not found.");
  }
  await TermsOfUseModel.deleteOne();
  return null;
};

export const TermsService = {
  createTerms,
  getTerms,
  updateTerms,
  deleteTerms,
};
