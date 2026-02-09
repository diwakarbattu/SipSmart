
import api from './api';

export const orderService = {
    getMyOrders: async () => {
        const response = await api.get('/orders/my-orders');
        return response.data;
    },

    createOrder: async (orderData: any) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    modifyOrder: async (orderId: string, updates: any) => {
        const response = await api.put(`/orders/${orderId}`, updates);
        return response.data;
    },

    cancelOrder: async (orderId: string, cancelReason?: string) => {
        const response = await api.delete(`/orders/${orderId}`, {
            data: { cancelReason }
        });
        return response.data;
    },

    updateOrderStatus: async (orderId: string, status: string) => {
        const response = await api.patch(`/orders/${orderId}/status`, { status });
        return response.data;
    }
};
