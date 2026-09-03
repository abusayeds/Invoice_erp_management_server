import express from "express";
import { trainingTypeRoutes } from "./trainingType/trainingType.route";
import { trainerRoutes } from "./trainer/trainer.route";
import { trainingMainRoutes } from "./training/training.route";
import {
  trainingTaskNestedRoutes,
  trainingTaskRoutes,
} from "./trainingTask/trainingTask.route";
import { trainingFeedbackRoutes } from "./trainingFeedback/trainingFeedback.route";

const router = express.Router();

// Configuration resources
router.use("/training-types", trainingTypeRoutes);
router.use("/trainers", trainerRoutes);

// Training + its nested tasks (create/list scoped to a parent training)
router.use("/trainings/:trainingId/tasks", trainingTaskNestedRoutes);
router.use("/trainings", trainingMainRoutes);

// Tasks (by id) + their nested feedbacks
router.use("/tasks/:taskId/feedbacks", trainingFeedbackRoutes);
router.use("/tasks", trainingTaskRoutes);

export const trainingRoutes = router;
