import api from './api';
import { Bottle } from '../state/OrderContext';

export const bottleService = {
    getBottles: async (): Promise<Bottle[]> => {
        const response = await api.get('/products');
        const data = response.data;
        // Handle both paginated ({ data: [...] }) and non-paginated ([...]) responses
        if (data && Array.isArray(data.data)) {
            return data.data;
        }
        return Array.isArray(data) ? data : [];
    },

    getBottleById: async (id: string): Promise<Bottle> => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
};
