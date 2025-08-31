import api from './api';
import { ActivityEvent } from './socketService';

export const activityService = {
  async getRecentActivities(limit?: number): Promise<ActivityEvent[]> {
    const response = await api.get('/activity/recent', {
      params: { limit }
    });
    return response.data.data.activities;
  },

  async getListActivities(listId: number, limit?: number): Promise<ActivityEvent[]> {
    const response = await api.get(`/activity/lists/${listId}`, {
      params: { limit }
    });
    return response.data.data.activities;
  },

  async getUserActivities(limit?: number): Promise<ActivityEvent[]> {
    const response = await api.get('/activity/user', {
      params: { limit }
    });
    return response.data.data.activities;
  }
};