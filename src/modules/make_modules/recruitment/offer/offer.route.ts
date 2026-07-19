import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { offerController } from "./offer.controller";

const router = express.Router();
const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.recruitment.offers;

router.post("/create", auth, permissionMiddleware(P.create_offers), offerController.create);
router.get("/all", auth, permissionMiddleware(P.manage_offers), offerController.getAll);
router.get("/single/:id", auth, permissionMiddleware(P.view_offers), offerController.getSingle);
router.patch("/edit/:id", auth, permissionMiddleware(P.edit_offers), offerController.update);
router.patch("/approval-status/:id", auth, permissionMiddleware(P.approve_offers), offerController.updateApprovalStatus);
router.post("/send-email/:id", auth, permissionMiddleware(P.send_offer_emails), offerController.sendEmail);
router.get("/download/:id", auth, permissionMiddleware(P.download_offer_letters), offerController.downloadOfferLetter);
router.post("/convert-to-employee/:id", auth, permissionMiddleware(P.convert_offers_to_employees), offerController.convertToEmployee);
router.delete("/delete/:id", auth, permissionMiddleware(P.delete_offers), offerController.remove);

export const offerRoutes = router;
