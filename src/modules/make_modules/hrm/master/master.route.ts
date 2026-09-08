import express from "express";
import { masterController, workingDaysGet, workingDaysUpdate, ipRestrictToggle } from "./master.controller";
import { crudPerms, hrmAuth, perm, permission } from "../shared/hrm.routeAuth";

const router = express.Router();
const hrm = permission.hrm;

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
  const p = crudPerms(r);
  router.get(`/${r}`, hrmAuth, p.list, masterController.list(r));
  router.get(`/${r}/:id`, hrmAuth, p.get, masterController.get(r));
  router.post(`/${r}`, hrmAuth, p.create, masterController.create(r));
  router.put(`/${r}/:id`, hrmAuth, p.edit, masterController.update(r));
  router.delete(`/${r}/:id`, hrmAuth, p.delete, masterController.remove(r));
}

router.get("/working-days", hrmAuth, perm(hrm.working_days.manage_working_days), workingDaysGet);
router.put("/working-days", hrmAuth, perm(hrm.working_days.edit_working_days), workingDaysUpdate);
router.post("/ip-restricts/toggle-setting", hrmAuth, perm(hrm.ip_restricts.manage_ip_restricts), ipRestrictToggle);

export const masterRoutes = router;
