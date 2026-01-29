import api from './api';
import type { User } from '../types';

export const userService = {
    getUsers: async (): Promise<User[]> => {
        const response = await api.get('/users');
        return response.data;
    },
    updateUser: async (id: string, data: any): Promise<User> => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },
    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`);
    },
};
