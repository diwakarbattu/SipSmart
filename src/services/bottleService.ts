import api from './api';
import { Bottle } from '../state/OrderContext';

export const bottleService = {
    getBottles: async (): Promise<Bottle[]> => {
        const response = await api.get('/products');
        return response.data;
    },

    getBottleById: async (id: string): Promise<Bottle> => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
};
