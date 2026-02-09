import api from './api';
import type { Order } from '../types';

interface OrderFilters {
    status?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
}

export const orderService = {
    getOrders: async (page = 1, limit = 20, filters?: OrderFilters): Promise<{ data: Order[]; pagination: any }> => {
        let url = `/orders?page=${page}&limit=${limit}`;
        if (filters) {
            if (filters.status) url += `&status=${filters.status}`;
            if (filters.userId) url += `&userId=${filters.userId}`;
            if (filters.startDate) url += `&startDate=${filters.startDate}`;
            if (filters.endDate) url += `&endDate=${filters.endDate}`;
        }
        const response = await api.get(url);
        return response.data;
    },
    updateOrderStatus: async (id: string, status: string): Promise<Order> => {
        const response = await api.patch(`/orders/${id}/status`, { status });
        return response.data;
    },
    deleteOrder: async (id: string): Promise<void> => {
        await api.delete(`/orders/${id}`);
    },
    getDashboardStats: async () => {
        const response = await api.get('/orders/stats/dashboard');
        return response.data;
    },
};
