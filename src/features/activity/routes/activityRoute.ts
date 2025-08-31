import express from "express";
import ActivityController from "../controller/activityController";
import { authMiddleware } from "../../../globals/middlewares/auth.middleware";

const activityRoute = express.Router();
const activityController = new ActivityController();

activityRoute.get('/lists/:listId', authMiddleware, activityController.getListHistory);
activityRoute.get('/user', authMiddleware, activityController.getUserHistory);
activityRoute.get('/recent', authMiddleware, activityController.getRecentActivities);
activityRoute.get('/stats', authMiddleware, activityController.getActivityStats);

export default activityRoute;