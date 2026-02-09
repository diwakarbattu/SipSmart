import api from './api';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { identity: email, password });
        if (response.data.token) {
            localStorage.setItem('admin_token', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('admin_token');
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
        const response = await api.post('/auth/change-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    },

    updateProfile: async (name: string, email: string) => {
        const response = await api.put('/auth/profile', { name, email });
        return response.data;
    },

    getNotifications: async () => {
        const response = await api.get('/auth/notifications');
        return response.data;
    },

    updateNotifications: async (settings: any) => {
        const response = await api.put('/auth/notifications', settings);
        return response.data;
    },

    getCurrentAdmin: () => {
        const token = localStorage.getItem('admin_token');
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload;
        } catch {
            return null;
        }
    }
};
