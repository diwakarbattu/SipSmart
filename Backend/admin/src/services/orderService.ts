import api from './api';
import type { Order } from '../types';

export const orderService = {
    getOrders: async (): Promise<Order[]> => {
        const response = await api.get('/orders');
        return response.data;
    },
    updateOrderStatus: async (id: string, status: string): Promise<Order> => {
        const response = await api.patch(`/orders/${id}/status`, { status });
        return response.data;
    },
    deleteOrder: async (id: string): Promise<void> => {
        await api.delete(`/orders/${id}`);
    },
};
