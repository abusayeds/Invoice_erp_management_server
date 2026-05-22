import express from "express";

import { authMiddleware } from "../../../middlewares/auth";

import { role } from "../../../utils/role";

import upload from "../../../middlewares/fileUploadNormal";

import { projectController } from "./project.controller";



const router = express.Router();

const auth = authMiddleware(role.company);



router.get("/dashboard/home", auth, projectController.dashboardHome);

router.get("/users", auth, projectController.getUsers);



router.get("/all", auth, projectController.listProjects);

router.get("/single/:id", auth, projectController.projectDetails);

router.get("/activity/:projectId", auth, projectController.projectActivity);



router.post("/create-update", auth, projectController.createUpdateProject);

router.post("/delete", auth, projectController.deleteProject);

router.post("/status-update", auth, projectController.statusUpdate);

router.post("/invite-member", auth, projectController.inviteMember);

router.post("/delete-member", auth, projectController.deleteMember);

router.post("/invite-client", auth, projectController.inviteClient);

router.post("/delete-client", auth, projectController.deleteClient);

router.post("/duplicate", auth, projectController.duplicateProject);



router.post("/milestone/create", auth, projectController.milestoneCreate);

router.post("/milestone/update", auth, projectController.milestoneUpdate);

router.post("/milestone/delete", auth, projectController.milestoneDelete);

router.get("/milestone/list/:projectId", auth, projectController.milestoneList);



router.get("/task/all", auth, projectController.taskList);

router.get("/task/single/:id", auth, projectController.taskDetails);

router.get("/taskboard/:projectId", auth, projectController.taskboard);

router.get("/task/comment/all/:taskId", auth, projectController.taskCommentList);

router.get("/task/subtask/all/:taskId", auth, projectController.subtaskList);



router.post("/task/create-update", auth, projectController.taskCreateUpdate);

router.post("/task/delete", auth, projectController.taskDelete);

router.post("/task/stage-update", auth, projectController.taskStageUpdate);

router.post("/task/comment/create", auth, projectController.taskCommentCreate);

router.post("/task/comment/delete", auth, projectController.taskCommentDelete);

router.post("/task/subtask/create", auth, projectController.subtaskCreate);

router.post("/task/subtask/toggle", auth, projectController.subtaskToggle);



router.get("/bug/all", auth, projectController.bugList);

router.get("/bug/single/:id", auth, projectController.bugDetails);

router.get("/bug/comment/all/:bugId", auth, projectController.bugCommentList);



router.post("/bug/create-update", auth, projectController.bugCreateUpdate);

router.post("/bug/delete", auth, projectController.bugDelete);

router.post("/bug/stage-update", auth, projectController.bugStageUpdate);

router.post("/bug/comment/create", auth, projectController.bugCommentCreate);

router.post("/bug/comment/delete", auth, projectController.bugCommentDelete);



router.get("/task-stage/all", auth, projectController.taskStageAll);

router.post("/task-stage/create", auth, projectController.taskStageCreate);

router.put("/task-stage/update/:id", auth, projectController.taskStageUpdateRoute);

router.delete("/task-stage/delete/:id", auth, projectController.taskStageDelete);

router.post("/task-stage/reorder", auth, projectController.taskStageReorder);



router.get("/bug-stage/all", auth, projectController.bugStageAll);

router.post("/bug-stage/create", auth, projectController.bugStageCreate);

router.put("/bug-stage/update/:id", auth, projectController.bugStageUpdateRoute);

router.delete("/bug-stage/delete/:id", auth, projectController.bugStageDelete);

router.post("/bug-stage/reorder", auth, projectController.bugStageReorder);



export const projectRoutes = router;

