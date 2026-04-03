import express from "express";
import { companyController } from "./company.controller";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";

const router = express.Router();

router.post("/create" , authMiddleware(role.user),companyController.createCompany);

router.get("/",  companyController.getAllCompanies);

router.get("/:id",  companyController.getSingleCompany);

router.patch("/update/:id",companyController.updateCompany);

router.delete("/delete/:id",  companyController.deleteCompany);

export const companyRoutes = router;