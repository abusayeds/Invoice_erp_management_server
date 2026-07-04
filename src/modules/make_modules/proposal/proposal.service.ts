import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { assertClientUser, CLIENT_POPULATE_SELECT } from "../../../utils/partyUser";
import { TProposal } from "./proposal.interface";
import { ProductModel } from "../product/product.model";
import { ServiceModel } from "../service/service.model";
import { TProduct } from "../product/product.interface";
import { TService } from "../service/service.interface";
import { calculateInvoice } from "../utils/calculateInvoice";
import { validateItemAmount } from "../utils/validateItemAmount";
import { ProposalModel } from "./proposal.model";
import queryBuilder from "../../../builder/queryBuilder";

const validateCustomerAndLineItems = async (payload: TProposal) => {
  if (payload.customer_id) {
    await assertClientUser(payload.customer_id);
  }
  if (Array.isArray(payload.product)) {
    for (const item of payload.product) {
      const product = (await ProductModel.findById(item.product_id)) as TProduct;
      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found with id: " + item.product_id);
      }
      if (product.pricing.sellPrice !== item.rate) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Product rate mismatch " + item.product_id + ": " + product.pricing.sellPrice + " vs " + item.rate
        );
      }
      validateItemAmount(item, "product");
    }
  }
  if (Array.isArray(payload.service)) {
    for (const item of payload.service) {
      const service = (await ServiceModel.findById(item.service_id)) as TService;
      if (!service) {
        throw new AppError(httpStatus.NOT_FOUND, "Service not found with id: " + item.service_id);
      }
      if (service.rate !== item.rate) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Service rate mismatch " + item.service_id + ": " + service.rate + " vs " + item.rate
        );
      }
      validateItemAmount(item, "service");
    }
  }
};

const createDB = async (payload: TProposal) => {
  await validateCustomerAndLineItems(payload);
  const result = await calculateInvoice(payload);
  const data = { ...payload, ...result };
  const createdRecord = await ProposalModel.create(data);
  return createdRecord;
};

const getSingleDB = async (id: string, userId: string) => {
  const record = await ProposalModel.findOne({
    _id: id,
    user_id: userId,
    isArchive: false,
    isDeleted: false,
  });
  if (!record) {
    throw new AppError(httpStatus.NOT_FOUND, "Proposal not found");
  }
  return record;
};

const getAllDB = async (query: Record<string, unknown>, user_id: string) => {
  const buildQuery = new queryBuilder(
    ProposalModel.find({
      user_id: user_id,
      isArchive: false,
      isDeleted: false,
    }).populate({
      path: "customer_id",
      select: CLIENT_POPULATE_SELECT,
    }),
    query
  )
    .search(["notes", "proposal_number"])
    .filter()
    .sort()
    .fields();
  const { totalData } = await buildQuery.paginate(
    ProposalModel.find({
      user_id: user_id,
      isArchive: false,
      isDeleted: false,
    })
  );
  const allRecords = await buildQuery.modelQuery.exec();
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = buildQuery.calculatePagination({ totalData, currentPage, limit });
  return { allRecords, pagination };
};

const updateDB = async (id: string, userId: string, payload: Partial<TProposal>) => {
  const existing = await ProposalModel.findOne({
    _id: id,
    user_id: userId
  });
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Proposal not found");
  }

  const plain = existing.toObject() as TProposal & { _id?: unknown; __v?: number };
  const patch = { ...payload } as Partial<TProposal> & { _id?: unknown };
  delete patch.user_id;
  delete patch._id;
  const merged = { ...plain, ...patch } as TProposal;
  merged.user_id = userId as unknown as TProposal["user_id"];

  await validateCustomerAndLineItems(merged);
  const calculated = await calculateInvoice(merged);
  const data = { ...merged, ...calculated } as Record<string, unknown>;
  delete data._id;
  delete data.__v;

  const updated = await ProposalModel.findOneAndUpdate(
    { _id: id, user_id: userId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Proposal not found");
  }
  return updated;
};

const deleteDB = async (id: string, userId: string) => {
  const doc = await ProposalModel.findOneAndUpdate(
    { _id: id, user_id: userId, isDeleted: false },
    { isDeleted: true, isArchive: true },
    { new: true }
  );
  if (!doc) {
    throw new AppError(httpStatus.NOT_FOUND, "Proposal not found");
  }
  return doc;
};

export const proposalService = { createDB, getSingleDB, getAllDB, updateDB, deleteDB };

