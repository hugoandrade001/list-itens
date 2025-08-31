import { PrismaClient } from "@prisma/client"
import { NotFoundExcepton } from "../../../globals/cores/errors"
import { ActivityLogService } from "../../activity/services/activityLogService"
import SocketManager from "../../../globals/socket/socketManager"

const prisma = new PrismaClient()
const activityLogService = new ActivityLogService()
const socketManager = SocketManager.getInstance()

interface CreateListData {
    title: string
    description?: string
    ownerId: number
}

interface UpdateListData {
    title?: string
    description?: string
}

export class ListService {

    public async create(listData: CreateListData) {
        const { title, description, ownerId } = listData

        const list = await prisma.list.create({
            data: {
                title,
                description,
                ownerId
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: true
            }
        })

        // Log the activity
        const activity = await activityLogService.logListActivity({
            action: 'list_created',
            userId: ownerId,
            listId: list.id
        })

        // Emit real-time events
        socketManager.emitListEvent('list_created', list, list.id)
        socketManager.emitActivityEvent({
            ...activity,
            message: ActivityLogService.getActionMessage(activity)
        })

        return list
    }

    public async getAllLists() {
        const lists = await prisma.list.findMany({
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: true,
                _count: {
                    select: {
                        items: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return lists
    }

    public async getListById(id: number) {
        const list = await prisma.list.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        })

        if (!list) {
            throw new NotFoundExcepton(`List with ID ${id} not found`)
        }

        return list
    }

    public async updateList(id: number, updateData: UpdateListData, userId: number) {
        // First check if list exists
        await this.getListById(id)

        const updatedList = await prisma.list.update({
            where: { id },
            data: updateData,
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: true
            }
        })

        // Log the activity
        const activity = await activityLogService.logListActivity({
            action: 'list_updated',
            userId: userId,
            listId: id
        })

        // Emit real-time events
        socketManager.emitListEvent('list_updated', updatedList, id)
        socketManager.emitActivityEvent({
            ...activity,
            message: ActivityLogService.getActionMessage(activity)
        })

        return updatedList
    }

    public async deleteList(id: number, userId: number) {
        // First check if list exists
        const existingList = await this.getListById(id)

        // Log the activity before deletion
        const activity = await activityLogService.logListActivity({
            action: 'list_deleted',
            userId: userId,
            listId: id
        })

        await prisma.list.delete({
            where: { id }
        })

        // Emit real-time events
        socketManager.emitListEvent('list_deleted', existingList, id)
        socketManager.emitActivityEvent({
            ...activity,
            message: ActivityLogService.getActionMessage(activity)
        })

        return { message: "List deleted successfully" }
    }

    public async getUserLists(userId: number) {
        const lists = await prisma.list.findMany({
            where: {
                ownerId: userId
            },
            include: {
                items: true,
                _count: {
                    select: {
                        items: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return lists
    }
}