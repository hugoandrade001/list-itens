import { Request, Response, NextFunction } from "express";
import { ListItemService } from "../services/listItemService";

class ListItemController {
    private listItemService: ListItemService;

    constructor() {
        this.listItemService = new ListItemService();
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, completed } = req.body
            const listId = parseInt(req.params.listId)

            // Validation
            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: "Title is required"
                })
            }

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

            const item = await this.listItemService.create({
                title,
                completed: completed || false,
                listId,
                userId
            })

            res.status(201).json({
                success: true,
                message: "Item added successfully",
                data: item
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

    public getItemsByListId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listId = parseInt(req.params.listId)

            if (isNaN(listId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid list ID"
                })
            }

            const result = await this.listItemService.getItemsByListId(listId)

            res.status(200).json({
                success: true,
                data: result
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

    public getItemById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const itemId = parseInt(req.params.itemId)

            if (isNaN(itemId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid item ID"
                })
            }

            const item = await this.listItemService.getItemById(itemId)

            res.status(200).json({
                success: true,
                data: item
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

    public updateItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const itemId = parseInt(req.params.itemId)
            const { title, completed } = req.body

            if (isNaN(itemId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid item ID"
                })
            }

            // At least one field should be provided
            if (title === undefined && completed === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "At least title or completed status must be provided"
                })
            }

            const updateData: any = {}
            if (title !== undefined) updateData.title = title
            if (completed !== undefined) updateData.completed = completed

            const userId = req.user?.userId
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User authentication required"
                })
            }

            const updatedItem = await this.listItemService.updateItem(itemId, updateData, userId)

            res.status(200).json({
                success: true,
                message: "Item updated successfully",
                data: updatedItem
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

    public deleteItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const itemId = parseInt(req.params.itemId)

            if (isNaN(itemId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid item ID"
                })
            }

            const userId = req.user?.userId
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User authentication required"
                })
            }

            const result = await this.listItemService.deleteItem(itemId, userId)

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

    public toggleCompletion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const itemId = parseInt(req.params.itemId)

            if (isNaN(itemId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid item ID"
                })
            }

            const userId = req.user?.userId
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User authentication required"
                })
            }

            const updatedItem = await this.listItemService.toggleItemCompletion(itemId, userId)

            res.status(200).json({
                success: true,
                message: "Item completion status toggled successfully",
                data: updatedItem
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

    public getStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listId = parseInt(req.params.listId)

            if (isNaN(listId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid list ID"
                })
            }

            const stats = await this.listItemService.getItemStats(listId)

            res.status(200).json({
                success: true,
                data: stats
            })

        } catch (error: any) {
            next(error)
        }
    }
}

export default ListItemController;