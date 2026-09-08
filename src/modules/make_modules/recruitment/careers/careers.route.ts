import express from "express";
import { careersController } from "./careers.controller";

// Public careers portal — no authentication. Company is identified by :companyId in the path.
const router = express.Router();

router.get("/:companyId/jobs", careersController.jobListings);
router.get("/:companyId/jobs/:jobId", careersController.jobDetails);
router.post("/:companyId/jobs/:jobId/apply", careersController.submitApplication);
router.post("/:companyId/track/verify", careersController.trackingVerify);
router.get("/:companyId/track/:trackingId", careersController.trackingDetails);
router.post("/:companyId/offers/:offerId/respond", careersController.offerResponse);

export const careersRoutes = router;
