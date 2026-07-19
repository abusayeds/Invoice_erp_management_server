import express from "express";
import { employeeController } from "./employee.controller";
import { hrmAuth, perm, permission } from "../shared/hrm.routeAuth";

const router = express.Router();
const e = permission.hrm.employees;

router.get("/generate-id", hrmAuth, perm(e.create_employees), employeeController.generateId);
router.get("/eligible-users", hrmAuth, perm(e.create_employees), employeeController.eligibleUsers);
router.get("/lookups", hrmAuth, perm(e.view_employees, e.create_employees), employeeController.lookups);
router.get("/", hrmAuth, perm(e.manage_employees), employeeController.list);
router.get("/:id", hrmAuth, perm(e.view_employees), employeeController.get);
router.post("/", hrmAuth, perm(e.create_employees), employeeController.create);
router.put("/:id", hrmAuth, perm(e.edit_employees), employeeController.update);
router.delete("/:id", hrmAuth, perm(e.delete_employees), employeeController.remove);
router.delete(
  "/:employeeId/documents/:documentId",
  hrmAuth,
  perm(e.edit_employees),
  employeeController.deleteDocument,
);

export const employeeRoutes = router;
