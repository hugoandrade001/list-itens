import api from './api';
import { User } from './authService';

export interface List {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  owner: User;
  items?: ListItem[];
  _count?: {
    items: number;
  };
}

export interface ListItem {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  listId: number;
  list?: {
    id: number;
    title: string;
  };
}

export interface CreateListData {
  title: string;
  description?: string;
}

export interface UpdateListData {
  title?: string;
  description?: string;
}

export const listService = {
  async getAllLists(): Promise<List[]> {
    const response = await api.get('/lists/getAllLists');
    return response.data.data;
  },

  async getListById(id: number): Promise<List> {
    const response = await api.get(`/lists/list/${id}`);
    return response.data.data;
  },

  async createList(data: CreateListData): Promise<List> {
    const response = await api.post('/lists/createList', data);
    return response.data.data;
  },

  async updateList(id: number, data: UpdateListData): Promise<List> {
    const response = await api.put(`/lists/update/${id}`, data);
    return response.data.data;
  },

  async deleteList(id: number): Promise<void> {
    await api.delete(`/lists/delete/${id}`);
  },

  async getUserLists(): Promise<List[]> {
    const response = await api.get('/lists/my-lists');
    return response.data.data;
  }
};