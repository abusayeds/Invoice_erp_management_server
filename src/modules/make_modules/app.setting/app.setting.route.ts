import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { appSettingController } from "./app.setting.controller";

const router = Router();

router.get("/", authMiddleware(role.company), appSettingController.getSetting);    
router.patch("/",    authMiddleware(role.company),   appSettingController.updateSetting); 

export const settingRoutes = router;