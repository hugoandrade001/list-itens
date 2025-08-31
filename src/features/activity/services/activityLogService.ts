import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface ActivityLogData {
    action: string
    userId: number
    listId?: number
    itemId?: number
}

export class ActivityLogService {

    public async logListActivity(data: ActivityLogData & { listId: number }) {
        const { action, userId, listId } = data
        
        const activity = await prisma.activityLog.create({
            data: {
                action,
                userId,
                listId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                list: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })

        return activity
    }

    public async logItemActivity(data: ActivityLogData & { listId: number, itemId: number }) {
        const { action, userId, listId, itemId } = data

        const activity = await prisma.activityLog.create({
            data: {
                action,
                userId,
                listId,
                itemId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                list: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                item: {
                    select: {
                        id: true,
                        title: true,
                        completed: true
                    }
                }
            }
        })

        return activity
    }

    public async getListActivityHistory(listId: number, limit?: number) {
        const activities = await prisma.activityLog.findMany({
            where: {
                listId: listId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                list: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                item: {
                    select: {
                        id: true,
                        title: true,
                        completed: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit || 50
        })

        return activities
    }

    public async getUserActivityHistory(userId: number, limit?: number) {
        const activities = await prisma.activityLog.findMany({
            where: {
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                list: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                item: {
                    select: {
                        id: true,
                        title: true,
                        completed: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit || 50
        })

        return activities
    }

    public async getRecentActivities(limit?: number) {
        const activities = await prisma.activityLog.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                list: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                item: {
                    select: {
                        id: true,
                        title: true,
                        completed: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit || 20
        })

        return activities
    }

    public async getActivityStats(listId?: number) {
        const whereClause = listId ? { listId } : {}

        const [totalActivities, actionStats] = await Promise.all([
            prisma.activityLog.count({
                where: whereClause
            }),
            prisma.activityLog.groupBy({
                by: ['action'],
                where: whereClause,
                _count: {
                    action: true
                }
            })
        ])

        const stats = {
            total: totalActivities,
            byAction: actionStats.reduce((acc, stat) => {
                acc[stat.action] = stat._count.action
                return acc
            }, {} as Record<string, number>)
        }

        return stats
    }
    public static getActionMessage(activity: any): string {
        const userName = activity.user.name
        const listTitle = activity.list?.title || 'Unknown List'
        const itemTitle = activity.item?.title || 'Unknown Item'

        switch (activity.action) {
            case 'list_created':
                return `${userName} created list "${listTitle}"`
            case 'list_updated':
                return `${userName} updated list "${listTitle}"`
            case 'list_deleted':
                return `${userName} deleted list "${listTitle}"`
            case 'item_created':
                return `${userName} added item "${itemTitle}" to "${listTitle}"`
            case 'item_updated':
                return `${userName} updated item "${itemTitle}" in "${listTitle}"`
            case 'item_completed':
                return `${userName} marked "${itemTitle}" as completed in "${listTitle}"`
            case 'item_uncompleted':
                return `${userName} marked "${itemTitle}" as incomplete in "${listTitle}"`
            case 'item_deleted':
                return `${userName} removed item "${itemTitle}" from "${listTitle}"`
            default:
                return `${userName} performed ${activity.action} on "${listTitle}"`
        }
    }
}