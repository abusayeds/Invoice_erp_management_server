import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { appSettingController } from "./app.setting.controller";

const router = Router();

router.get("/types", authMiddleware(role.company), appSettingController.getSettingTypes);
router.get("/", authMiddleware(role.company), appSettingController.getSetting);
router.patch("/",    authMiddleware(role.company),   appSettingController.updateSetting);
router.patch("/reset", authMiddleware(role.company), appSettingController.resetSetting);

export const settingRoutes = router;