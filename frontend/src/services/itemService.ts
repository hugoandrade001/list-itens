import api from './api';
import { ListItem } from './listService';

export interface CreateItemData {
  title: string;
  completed?: boolean;
  listId: number;
}

export interface UpdateItemData {
  title?: string;
  completed?: boolean;
}

export interface ListItemsResponse {
  list: {
    id: number;
    title: string;
    description?: string;
  };
  items: ListItem[];
}

export const itemService = {
  async getItemsByListId(listId: number): Promise<ListItemsResponse> {
    const response = await api.get(`/listItem/getItemsByListId/${listId}/items`);
    return response.data;
  },

  async createItem(data: CreateItemData): Promise<ListItem> {
    const response = await api.post(`/listItem/create/${data.listId}/items`, data);
    return response.data;
  },

  async updateItem(id: number, data: UpdateItemData): Promise<ListItem> {
    const response = await api.put(`/listItem/updateItem/items/${id}`, data);
    return response.data;
  },

  async deleteItem(id: number): Promise<void> {
    await api.delete(`/listItem/deleteItem/items/${id}`);
  },

  async toggleItemCompletion(id: number): Promise<ListItem> {
    const response = await api.patch(`/listItem/items/${id}/toggle`);
    return response.data;
  }
};