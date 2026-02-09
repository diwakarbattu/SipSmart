import api from './api';
import type { Product } from '../types';

export const productService = {
    getProducts: async (page = 1, limit = 20): Promise<{ data: Product[]; pagination: any }> => {
        const response = await api.get(`/products?page=${page}&limit=${limit}`);
        return response.data;
    },
    addProduct: async (data: any): Promise<Product> => {
        const response = await api.post('/products', data);
        return response.data;
    },
    updateProduct: async (id: string, data: any): Promise<Product> => {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },
    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/products/${id}`);
    },
};
