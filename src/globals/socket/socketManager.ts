import { Server as SocketIOServer } from 'socket.io';

class SocketManager {
    private static instance: SocketManager;
    private io: SocketIOServer | null = null;

    private constructor() {}

    public static getInstance(): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }

    public setIO(io: SocketIOServer): void {
        this.io = io;
    }

    public getIO(): SocketIOServer | null {
        return this.io;
    }

    public emitListEvent(event: string, data: any, listId?: number): void {
        if (!this.io) return;

        this.io.to('global').emit(event, data);

        if (listId) {
            this.io.to(`list_${listId}`).emit(event, data);
        }
    }

    public emitItemEvent(event: string, data: any, listId: number): void {
        if (!this.io) return;

        this.io.to('global').emit(event, data);

        this.io.to(`list_${listId}`).emit(event, data);
    }

    public emitActivityEvent(activity: any): void {
        if (!this.io) return;

        const event = 'new_activity';
        
        this.io.to('global').emit(event, activity);

        if (activity.listId) {
            this.io.to(`list_${activity.listId}`).emit(event, activity);
        }
    }

    public getConnectedUsersCount(): Promise<number> {
        if (!this.io) return Promise.resolve(0);
        
        return Promise.resolve(this.io.engine.clientsCount);
    }
}

export default SocketManager;