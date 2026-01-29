import api from './api';
import { Order } from '../state/OrderContext';

export const orderService = {
    getOrders: async (): Promise<Order[]> => {
        const response = await api.get('/orders/my-orders');
        return response.data;
    },

    createOrder: async (orderData: any): Promise<Order> => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    updateOrderStatus: async (id: string, status: string): Promise<Order> => {
        const response = await api.patch(`/orders/${id}/status`, { status });
        return response.data;
    },
};
