import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../../errors/AppError";
import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import { createPerformanceCrudService } from "../performance.crud.service";
import { companyScope, refName, resolveCompanyId } from "../performance.utils";
import { IndicatorCategoryModel } from "../indicatorCategory/indicatorCategory.model";
import { PerformanceIndicatorModel } from "./indicator.model";
import { TPerformanceIndicator } from "./indicator.interface";

const P = permission.performance.performance_indicator;

const validateCategory = async (body: Record<string, unknown>, req: AuthRequest) => {
  const categoryId = body.category_id;
  if (categoryId !== undefined && categoryId !== null && categoryId !== "") {
    if (!Types.ObjectId.isValid(String(categoryId))) {
      throw new AppError(httpStatus.BAD_REQUEST, "Valid category is required");
    }
    const companyId = resolveCompanyId(req);
    const category = await IndicatorCategoryModel.findOne({
      _id: categoryId,
      ...companyScope(companyId),
    });
    if (!category) {
      throw new AppError(httpStatus.BAD_REQUEST, "Indicator category not found in your company");
    }
  }
  return body;
};

export const indicatorService = createPerformanceCrudService<TPerformanceIndicator>({
  model: PerformanceIndicatorModel,
  label: "Performance indicator",
  perms: {
    manageAny: P.manage_any_performance_indicators,
    manageOwn: P.manage_own_performance_indicators,
  },
  searchFields: ["name", "description", "measurement_unit"],
  populate: { path: "category_id", select: "name" },
  beforeCreate: validateCategory,
  beforeUpdate: validateCategory,
  formatItem: (d) => ({
    _id: d._id,
    name: d.name,
    description: d.description ?? null,
    measurement_unit: d.measurement_unit ?? null,
    target_value: d.target_value ?? null,
    status: d.status,
    category: refName(d.category_id),
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }),
});
