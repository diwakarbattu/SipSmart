import api from './api';

export interface UserProfile {
    id: string;
    name: string;
    mobile: string;
    email: string;
    address: string;
    role: string;
    rewardPoints: number;
    profilePic?: string;
}

export const userService = {
    getProfile: async (id: string): Promise<UserProfile> => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    updateProfile: async (id: string, userData: Partial<UserProfile>): Promise<UserProfile> => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },
};
