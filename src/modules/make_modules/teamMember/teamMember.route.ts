import express from "express";
import { TeamMemberController } from "./teamMember.controller";
import { inviteTeamMemberSchema, updateTeamMemberSchema } from "./teamMember.validation";
import validateRequest from "../../../middlewares/zodValidationHandler";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";

const router = express.Router();

router.post(
  "/invite",
  authMiddleware(role.company), 
  validateRequest(inviteTeamMemberSchema),
  TeamMemberController.inviteTeamMember
);

router.get(
  "/",
  authMiddleware(role.company),
  TeamMemberController.getTeamMembers
);

router.patch(
  "/:id",
  authMiddleware(role.company),
  validateRequest(updateTeamMemberSchema),
  TeamMemberController.updateTeamMember
);

router.delete(
  "/:id",
  authMiddleware(role.company),
  TeamMemberController.deleteTeamMember
);

export const TeamMemberRoutes = router;
