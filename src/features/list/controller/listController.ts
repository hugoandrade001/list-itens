import { Request, Response, NextFunction } from "express";
import { ListService } from "../services/listService";

class ListController {
    private listService: ListService;

    constructor() {
        this.listService = new ListService();
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, description } = req.body

            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: "Title is required"
                })
            }

            const ownerId = req.user?.userId

            if (!ownerId) {
                return res.status(401).json({
                    success: false,
                    message: "User authentication required"
                })
            }

            const list = await this.listService.create({
                title,
                description,
                ownerId
            })

            res.status(201).json({
                success: true,
                message: "List created successfully",
                data: list
            })

        } catch (error: any) {
            next(error)
        }
    }

    public getAllLists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lists = await this.listService.getAllLists()

            res.status(200).json({
                success: true,
                data: lists
            })

        } catch (error: any) {
            next(error)
        }
    }

    public getListById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listId = parseInt(req.params.id)

            if (isNaN(listId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid list ID"
                })
            }

            const list = await this.listService.getListById(listId)

            res.status(200).json({
                success: true,
                data: list
            })

        } catch (error: any) {
            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                })
            }
            next(error)
        }
    }

    public updateList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listId = parseInt(req.params.id)
            const { title, description } = req.body

            if (isNaN(listId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid list ID"
                })
            }

            if (!title && !description) {
                return res.status(400).json({
                    success: false,
                    message: "At least title or description must be provided"
                })
            }

            const updateData: any = {}
            if (title) updateData.title = title
            if (description !== undefined) updateData.description = description

            const userId = req.user?.userId
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User authentication required"
                })
            }

            const updatedList = await this.listService.updateList(listId, updateData, userId)

            res.status(200).json({
                success: true,
                message: "List updated successfully",
                data: updatedList
            })

        } catch (error: any) {
            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                })
            }
            next(error)
        }
    }

    public deleteList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listId = parseInt(req.params.id)

            if (isNaN(listId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid list ID"
                })
            }

            const userId = req.user?.userId
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User authentication required"
                })
            }

            const result = await this.listService.deleteList(listId, userId)

            res.status(200).json({
                success: true,
                message: result.message
            })

        } catch (error: any) {
            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                })
            }
            next(error)
        }
    }

    public getUserLists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User authentication required"
                })
            }

            const lists = await this.listService.getUserLists(userId)

            res.status(200).json({
                success: true,
                data: lists
            })

        } catch (error: any) {
            next(error)
        }
    }
}

export default ListController;