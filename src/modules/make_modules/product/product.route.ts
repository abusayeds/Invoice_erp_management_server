import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { productController } from "./product.controller";

const router = express.Router();

router.post(
  "/create",
  authMiddleware(role.user),
  productController.productCreate
);
router.get(
  "/all",
  authMiddleware(role.user),
  productController.allProduct
);
router.get(
  "/single/:id",
  authMiddleware(role.user),
);
router.post(
  "/delete",
  authMiddleware(role.user),
);


export const productRoutes = router;