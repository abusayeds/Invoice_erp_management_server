import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { productController } from "./product.controller";

const router = express.Router();

router.post(
  "/create",
  authMiddleware(role.company),
  productController.productCreate
);
router.get(
  "/all",
  authMiddleware(role.company),
  productController.allProduct
);
router.get(
  "/single/:id",
  authMiddleware(role.company),
  productController.singleProduct
);
router.post(
  "/delete",
  authMiddleware(role.company),
  productController.deleteProduct
);


export const productRoutes = router;