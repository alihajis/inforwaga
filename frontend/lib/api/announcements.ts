import { apiClient } from './client';
import { Announcement } from '@/types';
import { authUtils } from '../utils/auth';

export const announcementsApi = {
  getAll: async (limit = 10, offset = 0) => {
    return apiClient.get<{
      announcements: Announcement[];
      total: number;
      limit: number;
      offset: number;
    }>(`/announcements?limit=${limit}&offset=${offset}`);
  },

  getById: async (id: number) => {
    return apiClient.get<{ announcement: Announcement }>(
      `/announcements/${id}`
    );
  },

  create: async (data: Partial<Announcement>) => {
    const token = authUtils.getToken();
    if (!token) throw new Error('Authentication required');

    return apiClient.post<{ message: string; announcement: Announcement }>(
      '/announcements',
      data,
      token
    );
  },

  update: async (id: number, data: Partial<Announcement>) => {
    const token = authUtils.getToken();
    if (!token) throw new Error('Authentication required');

    return apiClient.put<{ message: string; announcement: Announcement }>(
      `/announcements/${id}`,
      data,
      token
    );
  },

  delete: async (id: number) => {
    const token = authUtils.getToken();
    if (!token) throw new Error('Authentication required');

    return apiClient.delete<{ message: string }>(
      `/announcements/${id}`,
      token
    );
  },
};
