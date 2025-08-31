import { io, Socket } from 'socket.io-client';
import { List, ListItem } from './listService';

export interface ActivityEvent {
  id: number;
  action: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  list?: {
    id: number;
    title: string;
  };
  item?: {
    id: number;
    title: string;
    completed: boolean;
  };
  message: string;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io('http://localhost:4000', {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join a specific list room for targeted updates
  joinList(listId: number) {
    if (this.socket) {
      this.socket.emit('join_list', listId.toString());
    }
  }

  // Leave a specific list room
  leaveList(listId: number) {
    if (this.socket) {
      this.socket.emit('leave_list', listId.toString());
    }
  }

  // List event listeners
  onListCreated(callback: (list: List) => void) {
    if (this.socket) {
      this.socket.on('list_created', callback);
    }
  }

  onListUpdated(callback: (list: List) => void) {
    if (this.socket) {
      this.socket.on('list_updated', callback);
    }
  }

  onListDeleted(callback: (list: List) => void) {
    if (this.socket) {
      this.socket.on('list_deleted', callback);
    }
  }

  // Item event listeners
  onItemCreated(callback: (item: ListItem) => void) {
    if (this.socket) {
      this.socket.on('item_created', callback);
    }
  }

  onItemUpdated(callback: (item: ListItem) => void) {
    if (this.socket) {
      this.socket.on('item_updated', callback);
    }
  }

  onItemDeleted(callback: (item: ListItem) => void) {
    if (this.socket) {
      this.socket.on('item_deleted', callback);
    }
  }

  onItemToggled(callback: (item: ListItem) => void) {
    if (this.socket) {
      this.socket.on('item_toggled', callback);
    }
  }

  // Activity event listener
  onNewActivity(callback: (activity: ActivityEvent) => void) {
    if (this.socket) {
      this.socket.on('new_activity', callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Check connection status
  get connected() {
    return this.isConnected && this.socket?.connected;
  }
}

export const socketService = new SocketService();