import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { role } from "../../../../utils/role";
import { balanceSheetController } from "./balanceSheet.controller";

const router = express.Router();

router.get("/list", authMiddleware(role.company), balanceSheetController.list);
router.get("/comparisons", authMiddleware(role.company), balanceSheetController.comparisons);
router.get("/comparison/print", authMiddleware(role.company), balanceSheetController.comparisonPrint);
router.post("/compare", authMiddleware(role.company), balanceSheetController.compare);
router.post("/year-end-close", authMiddleware(role.company), balanceSheetController.yearEndClose);
router.get("/latest", authMiddleware(role.company), balanceSheetController.latest);
router.get("/comparison/:id", authMiddleware(role.company), balanceSheetController.showComparison);
router.get("/", authMiddleware(role.company), balanceSheetController.list);
router.post("/", authMiddleware(role.company), balanceSheetController.create);
router.get("/:id/print", authMiddleware(role.company), balanceSheetController.print);
router.post("/:id/finalize", authMiddleware(role.company), balanceSheetController.finalize);
router.post("/:id/notes", authMiddleware(role.company), balanceSheetController.addNote);
router.delete(
  "/:balanceSheetId/notes/:noteId",
  authMiddleware(role.company),
  balanceSheetController.deleteNote
);
router.get("/:id", authMiddleware(role.company), balanceSheetController.show);
router.delete("/:id", authMiddleware(role.company), balanceSheetController.remove);

export const balanceSheetRoutes = router;
