import { apiClient } from './client';
import { AuthResponse, User } from '@/types';
import { authUtils } from '../utils/auth';

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    // Save token and user
    authUtils.setToken(response.token);
    authUtils.setUser(response.user);

    return response;
  },

  register: async (data: {
    email: string;
    password: string;
    full_name: string;
    address: string;
    phone: string;
    nik?: string;
  }) => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    // Save token and user
    authUtils.setToken(response.token);
    authUtils.setUser(response.user);

    return response;
  },

  getProfile: async () => {
    const token = authUtils.getToken();
    if (!token) throw new Error('Not authenticated');

    return apiClient.get<{ user: User }>('/auth/profile', token);
  },

  logout: () => {
    authUtils.logout();
  },
};
