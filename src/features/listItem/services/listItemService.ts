import { PrismaClient } from "@prisma/client"
import { NotFoundExcepton } from "../../../globals/cores/errors"
import { ActivityLogService } from "../../activity/services/activityLogService"
import SocketManager from "../../../globals/socket/socketManager"

const prisma = new PrismaClient()
const activityLogService = new ActivityLogService()
const socketManager = SocketManager.getInstance()

interface CreateItemData {
    title: string
    completed?: boolean
    listId: number
    userId: number
}

interface UpdateItemData {
    title?: string
    completed?: boolean
}

export class ListItemService {

    public async create(itemData: CreateItemData) {
        const { title, completed = false, listId, userId } = itemData

        // Check if list exists
        const list = await prisma.list.findUnique({
            where: { id: listId }
        })

        if (!list) {
            throw new NotFoundExcepton(`List with ID ${listId} not found`)
        }

        const item = await prisma.listItem.create({
            data: {
                title,
                completed,
                listId
            },
            include: {
                list: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })

        // Log the activity
        const activity = await activityLogService.logItemActivity({
            action: 'item_created',
            userId: userId,
            listId: listId,
            itemId: item.id
        })

        // Emit real-time events
        socketManager.emitItemEvent('item_created', item, listId)
        socketManager.emitActivityEvent({
            ...activity,
            message: ActivityLogService.getActionMessage(activity)
        })

        return item
    }

    public async getItemsByListId(listId: number) {
        // Check if list exists
        const list = await prisma.list.findUnique({
            where: { id: listId }
        })

        if (!list) {
            throw new NotFoundExcepton(`List with ID ${listId} not found`)
        }

        const items = await prisma.listItem.findMany({
            where: {
                listId: listId
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        return {
            list: {
                id: list.id,
                title: list.title,
                description: list.description
            },
            items
        }
    }

    public async getItemById(itemId: number) {
        const item = await prisma.listItem.findUnique({
            where: { id: itemId },
            include: {
                list: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })

        if (!item) {
            throw new NotFoundExcepton(`Item with ID ${itemId} not found`)
        }

        return item
    }

    public async updateItem(itemId: number, updateData: UpdateItemData, userId: number) {
        // First check if item exists
        const existingItem = await this.getItemById(itemId)

        const updatedItem = await prisma.listItem.update({
            where: { id: itemId },
            data: updateData,
            include: {
                list: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })

        // Log the activity
        const activity = await activityLogService.logItemActivity({
            action: 'item_updated',
            userId: userId,
            listId: existingItem.list.id,
            itemId: itemId
        })

        // Emit real-time events
        socketManager.emitItemEvent('item_updated', updatedItem, existingItem.list.id)
        socketManager.emitActivityEvent({
            ...activity,
            message: ActivityLogService.getActionMessage(activity)
        })

        return updatedItem
    }

    public async deleteItem(itemId: number, userId: number) {
        // First check if item exists
        const existingItem = await this.getItemById(itemId)

        // Log the activity before deletion
        const activity = await activityLogService.logItemActivity({
            action: 'item_deleted',
            userId: userId,
            listId: existingItem.list.id,
            itemId: itemId
        })

        await prisma.listItem.delete({
            where: { id: itemId }
        })

        // Emit real-time events
        socketManager.emitItemEvent('item_deleted', existingItem, existingItem.list.id)
        socketManager.emitActivityEvent({
            ...activity,
            message: ActivityLogService.getActionMessage(activity)
        })

        return { message: "Item deleted successfully" }
    }

    public async toggleItemCompletion(itemId: number, userId: number) {
        const item = await this.getItemById(itemId)
        const newCompletedStatus = !item.completed

        const updatedItem = await prisma.listItem.update({
            where: { id: itemId },
            data: {
                completed: newCompletedStatus
            },
            include: {
                list: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })

        // Log the activity with specific completion action
        const activity = await activityLogService.logItemActivity({
            action: newCompletedStatus ? 'item_completed' : 'item_uncompleted',
            userId: userId,
            listId: item.list.id,
            itemId: itemId
        })

        // Emit real-time events
        socketManager.emitItemEvent('item_toggled', updatedItem, item.list.id)
        socketManager.emitActivityEvent({
            ...activity,
            message: ActivityLogService.getActionMessage(activity)
        })

        return updatedItem
    }

    public async getItemStats(listId: number) {
        const items = await prisma.listItem.findMany({
            where: { listId }
        })

        const total = items.length
        const completed = items.filter(item => item.completed).length
        const pending = total - completed

        return {
            total,
            completed,
            pending,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        }
    }
}