import express from "express";
import { authMiddleware } from "../../../../middlewares/auth";
import { permissionMiddleware } from "../../../../middlewares/permissionMiddleware";
import { permission } from "../../../../utils/permission";
import { role } from "../../../../utils/role";
import { trainingTaskController } from "./trainingTask.controller";

const auth = authMiddleware(role.company, role.hr, role.staff);
const P = permission.training.training;

// Nested under a training: /trainings/:trainingId/tasks
const nested = express.Router({ mergeParams: true });
nested.post("/create", auth, permissionMiddleware(P.create_training_tasks), trainingTaskController.create);
nested.get("/all", auth, permissionMiddleware(P.manage_training_tasks), trainingTaskController.getAll);

// Flat by task id: /tasks/*
const flat = express.Router();
flat.get("/single/:id", auth, permissionMiddleware(P.manage_training_tasks), trainingTaskController.getSingle);
flat.patch("/edit/:id", auth, permissionMiddleware(P.edit_training_tasks), trainingTaskController.update);
flat.patch("/complete/:id", auth, permissionMiddleware(P.edit_training_tasks), trainingTaskController.complete);
flat.delete("/delete/:id", auth, permissionMiddleware(P.delete_training_tasks), trainingTaskController.remove);

export const trainingTaskNestedRoutes = nested;
export const trainingTaskRoutes = flat;
