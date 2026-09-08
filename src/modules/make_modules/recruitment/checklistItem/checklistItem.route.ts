import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { checklistItemController } from "./checklistItem.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.checklist_items;

router.post("/create", auth, permissionMiddleware(P.create_checklist_items), checklistItemController.create);
router.get("/all", auth, permissionMiddleware(P.manage_checklist_items), checklistItemController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_checklist_items), checklistItemController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_checklist_items), checklistItemController.update);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_checklist_items), checklistItemController.remove);

export const checklistItemRoutes = router;
