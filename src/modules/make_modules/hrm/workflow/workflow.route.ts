import express from "express";
import { workflowController } from "./workflow.controller";
import { crudPerms, hrmAuth, perm, permission } from "../shared/hrm.routeAuth";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";

const router = express.Router();
const hrm = permission.hrm;

const resources = [
"holidays","awards","promotions","resignations","terminations","warnings","complaints","employee-transfers","events","announcements","documents","acknowledgments",
] as const;

const statusPerm = {
  promotions: hrm.promotions.manage_promotions_status,
  resignations: hrm.resignations.manage_resignation_status,
  terminations: hrm.terminations.manage_termination_status,
  complaints: hrm.complaints.manage_complaint_status,
  "employee-transfers": hrm.employee_transfers.manage_employee_transfers_status,
  events: hrm.events.manage_event_status,
  announcements: hrm.announcements.manage_announcements_status,
  documents: hrm.hrm_documents.manage_hrm_documents_status,
  acknowledgments: hrm.acknowledgments.manage_acknowledgment_status,
} as const;

router.get("/events/event-calendar", hrmAuth, perm(hrm.events.manage_events), workflowController.eventCalendar);
router.put(
  "/resignations/:id/status/:status",
  hrmAuth,
  perm(hrm.resignations.manage_resignation_status),
  workflowController.resignationStatusPath,
);

for (const r of resources) {
  const moduleKey = r === "documents" ? "hrm-documents" : r;
  const p = crudPerms(moduleKey);
  router.get(`/${r}`, hrmAuth, p.list, workflowController.list(r));
  router.get(`/${r}/:id`, hrmAuth, p.get, workflowController.get(r));
  router.post(`/${r}`, authMiddleware(role.company , role.hr), p.create, workflowController.create(r));
  router.put(`/${r}/:id`, hrmAuth, p.edit, workflowController.update(r));
  router.delete(`/${r}/:id`, hrmAuth, p.delete, workflowController.remove(r));
  const status = statusPerm[r as keyof typeof statusPerm];
  if (status) {
    router.put(`/${r}/:id/status`, hrmAuth, perm(status), workflowController.updateStatus(r, status));
  }
}

router.put(
  "/warnings/:id/response",
  hrmAuth,
  perm(hrm.warnings.manage_warning_response),
  workflowController.warningResponse,
);

export const workflowRoutes = router;
