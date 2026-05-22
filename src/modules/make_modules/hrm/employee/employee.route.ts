import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { employeeController } from "./employee.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);

router.get("/generate-id", auth, employeeController.generateId);
router.get("/eligible-users", auth, employeeController.eligibleUsers);
router.get("/lookups", auth, employeeController.lookups);
router.get("/", auth, employeeController.list);
router.get("/:id", auth, employeeController.get);
router.post("/", auth, employeeController.create);
router.put("/:id", auth, employeeController.update);
router.delete("/:id", auth, employeeController.remove);
router.delete("/:employeeId/documents/:documentId", auth, employeeController.deleteDocument);

export const employeeRoutes = router;
