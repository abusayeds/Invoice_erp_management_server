import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { workflowController } from "./workflow.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);

const resources = [
  "holidays",
  "awards",
  "promotions",
  "resignations",
  "terminations",
  "warnings",
  "complaints",
  "employee-transfers",
  "events",
  "announcements",
  "documents",
  "acknowledgments",
] as const;

const statusPerm: Record<string, string> = {
  promotions: "manage-promotions-status",
  resignations: "manage-resignation-status",
  terminations: "manage-termination-status",
  complaints: "manage-complaint-status",
  "employee-transfers": "manage-employee-transfers-status",
  events: "manage-event-status",
  announcements: "manage-announcements-status",
  documents: "manage-hrm-documents-status",
  acknowledgments: "manage-acknowledgment-status",
};

router.get("/events/event-calendar", auth, workflowController.eventCalendar);
router.put("/resignations/:id/status/:status", auth, workflowController.resignationStatusPath);

for (const r of resources) {
  router.get(`/${r}`, auth, workflowController.list(r));
  router.get(`/${r}/:id`, auth, workflowController.get(r));
  router.post(`/${r}`, auth, workflowController.create(r));
  router.put(`/${r}/:id`, auth, workflowController.update(r));
  router.delete(`/${r}/:id`, auth, workflowController.remove(r));
  if (statusPerm[r]) {
    router.put(`/${r}/:id/status`, auth, workflowController.updateStatus(r, statusPerm[r]));
  }
}

router.put("/warnings/:id/response", auth, workflowController.warningResponse);

export const workflowRoutes = router;
