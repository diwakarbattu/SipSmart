import api from './api';
import type { User } from '../types';

export const userService = {
    getUsers: async (page = 1, limit = 20): Promise<{ data: User[]; pagination: any }> => {
        const response = await api.get(`/users?page=${page}&limit=${limit}`);
        return response.data;
    },
    updateUser: async (id: string, data: any): Promise<User> => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },
    approveUser: async (id: string, isApproved: boolean): Promise<User> => {
        const response = await api.put(`/users/${id}`, { isApproved });
        return response.data;
    },
    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`);
    },
};
