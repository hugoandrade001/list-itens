import { Request, Response, NextFunction } from "express";
import { ActivityLogService } from "../services/activityLogService";

class ActivityController {
    private activityLogService: ActivityLogService;

    constructor() {
        this.activityLogService = new ActivityLogService();
    }

    public getListHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listId = parseInt(req.params.listId)
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined

            if (isNaN(listId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid list ID"
                })
            }

            const activities = await this.activityLogService.getListActivityHistory(listId, limit)
            
            const activitiesWithMessages = activities.map((activity: any) => ({
                ...activity,
                message: ActivityLogService.getActionMessage(activity)
            }))

            res.status(200).json({
                success: true,
                data: {
                    listId,
                    activities: activitiesWithMessages,
                    total: activitiesWithMessages.length
                }
            })

        } catch (error: any) {
            next(error)
        }
    }

    public getUserHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User authentication required"
                })
            }

            const activities = await this.activityLogService.getUserActivityHistory(userId, limit)
            
            const activitiesWithMessages = activities.map((activity: any) => ({
                ...activity,
                message: ActivityLogService.getActionMessage(activity)
            }))

            res.status(200).json({
                success: true,
                data: {
                    userId,
                    activities: activitiesWithMessages,
                    total: activitiesWithMessages.length
                }
            })

        } catch (error: any) {
            next(error)
        }
    }

    public getRecentActivities = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined

            const activities = await this.activityLogService.getRecentActivities(limit)
            
            const activitiesWithMessages = activities.map((activity: any) => ({
                ...activity,
                message: ActivityLogService.getActionMessage(activity)
            }))

            res.status(200).json({
                success: true,
                data: {
                    activities: activitiesWithMessages,
                    total: activitiesWithMessages.length
                }
            })

        } catch (error: any) {
            next(error)
        }
    }

    public getActivityStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listId = req.query.listId ? parseInt(req.query.listId as string) : undefined

            if (req.query.listId && isNaN(listId!)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid list ID"
                })
            }

            const stats = await this.activityLogService.getActivityStats(listId)

            res.status(200).json({
                success: true,
                data: {
                    listId: listId || 'all',
                    stats
                }
            })

        } catch (error: any) {
            next(error)
        }
    }
}

export default ActivityController;