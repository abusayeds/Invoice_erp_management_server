import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { masterController, workingDaysGet, workingDaysUpdate, ipRestrictToggle } from "./master.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);

const resources = [
  "branches",
  "departments",
  "designations",
  "shifts",
  "employee-document-types",
  "award-types",
  "termination-types",
  "warning-types",
  "complaint-types",
  "holiday-types",
  "document-categories",
  "announcement-categories",
  "event-types",
  "allowance-types",
  "deduction-types",
  "loan-types",
  "leave-types",
  "ip-restricts",
] as const;

for (const r of resources) {
  router.get(`/${r}`, auth, masterController.list(r));
  router.get(`/${r}/:id`, auth, masterController.get(r));
  router.post(`/${r}`, auth, masterController.create(r));
  router.put(`/${r}/:id`, auth, masterController.update(r));
  router.delete(`/${r}/:id`, auth, masterController.remove(r));
}

router.get("/working-days", auth, workingDaysGet);
router.put("/working-days", auth, workingDaysUpdate);
router.post("/ip-restricts/toggle-setting", auth, ipRestrictToggle);

export const masterRoutes = router;
