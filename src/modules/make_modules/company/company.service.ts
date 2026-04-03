import httpStatus from "http-status";

import { Company } from "./company.model";
import { TCompany } from "./conmapy.interface";
import AppError from "../../../errors/AppError";

// Create
const createCompany = async (payload: TCompany) => {
  const result = await Company.create(payload);
  return result;
};

// Get All
const getAllCompanies = async () => {
  const result = await Company.find();
  return result;
};

// Get Single
const getSingleCompany = async (id: string) => {
  const result = await Company.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Company not found");
  }
  return result;
};

// Update
const updateCompany = async (id: string, payload: Partial<TCompany>) => {
  const exists = await Company.findById(id);
  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, "Company not found");
  }

  const result = await Company.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );
  return result;
};

// Delete
const deleteCompany = async (id: string) => {
  const exists = await Company.findById(id);
  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, "Company not found");
  }

  const result = await Company.findByIdAndDelete(id);
  return result;
};

export const companyService = {
  createCompany,
  getAllCompanies,
  getSingleCompany,
  updateCompany,
  deleteCompany,
};