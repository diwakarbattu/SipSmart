import api from './api';
import type { Offer } from '../types';

export const offerService = {
    getOffers: async (): Promise<Offer[]> => {
        const response = await api.get('/offers');
        return response.data;
    },

    addOffer: async (offerData: Omit<Offer, 'id'>): Promise<Offer> => {
        const response = await api.post('/offers', offerData);
        return response.data;
    },

    updateOffer: async (id: string, offerData: Partial<Offer>): Promise<Offer> => {
        const response = await api.put(`/offers/${id}`, offerData);
        return response.data;
    },

    deleteOffer: async (id: string): Promise<void> => {
        await api.delete(`/offers/${id}`);
    }
};
