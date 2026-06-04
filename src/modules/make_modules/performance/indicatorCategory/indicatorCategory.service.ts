import { permission } from "../../../../utils/permission";
import { createPerformanceCrudService } from "../performance.crud.service";
import { IndicatorCategoryModel } from "./indicatorCategory.model";
import { TIndicatorCategory } from "./indicatorCategory.interface";

const P = permission.performance.performance_indicator_category;

export const indicatorCategoryService = createPerformanceCrudService<TIndicatorCategory>({
  model: IndicatorCategoryModel,
  label: "Performance indicator category",
  perms: {
    manageAny: P.manage_any_performance_indicator_categories,
    manageOwn: P.manage_own_performance_indicator_categories,
  },
  searchFields: ["name", "description"],
  nameField: "name",
});
