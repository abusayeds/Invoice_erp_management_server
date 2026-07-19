import { AuthRequest } from "../../../../middlewares/auth";
import { permission } from "../../../../utils/permission";
import { createPerformanceCrudService } from "../performance.crud.service";
import { companyScope, refName, resolveCompanyId } from "../performance.utils";
import { PerformanceEmployeeReviewModel } from "../employeeReview/employeeReview.model";
import { PerformanceReviewCycleModel } from "./reviewCycle.model";
import { TPerformanceReviewCycle } from "./reviewCycle.interface";

const P = permission.performance.review_cycle;

const base = createPerformanceCrudService<TPerformanceReviewCycle>({
  model: PerformanceReviewCycleModel,
  label: "Review cycle",
  perms: {
    manageAny: P.manage_any_review_cycles,
    manageOwn: P.manage_own_review_cycles,
  },
  searchFields: ["name", "description", "frequency"],
  nameField: "name",
  // creator_id / user_id(company=created_by) needed by the Show page.
  populate: [
    { path: "creator_id", select: "name" },
    { path: "user_id", select: "name" },
  ],
  formatItem: (d) => ({
    _id: d._id,
    name: d.name,
    frequency: d.frequency,
    description: d.description ?? null,
    status: d.status,
    createdAt: d.createdAt,
  }),
});

// Show page also needs creator, created_by and the cycle's employee reviews.
const single = async (req: AuthRequest, id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cycle = (await base.getOwned(req, id)) as any;
  const companyId = resolveCompanyId(req);
  const reviews = await PerformanceEmployeeReviewModel.find({
    review_cycle_id: id,
    ...companyScope(companyId),
  })
    .populate([
      { path: "employee_user_id", select: "name" },
      { path: "reviewer_id", select: "name" },
    ])
    .sort("-createdAt");

  return {
    _id: cycle._id,
    name: cycle.name,
    frequency: cycle.frequency,
    description: cycle.description ?? null,
    status: cycle.status,
    createdAt: cycle.createdAt,
    creator: refName(cycle.creator_id),
    created_by: refName(cycle.user_id),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    employee_reviews: reviews.map((r: any) => ({
      _id: r._id,
      user: refName(r.employee_user_id),
      reviewer: refName(r.reviewer_id),
      status: r.status,
      review_date: r.review_date,
      completion_date: r.completion_date ?? null,
    })),
  };
};

export const reviewCycleService = { ...base, single };
