import api from './api';

export const authService = {
    login: async (identity: string, password: string) => {
        const response = await api.post('/auth/login', { identity, password });
        if (response.data.token && response.data.user.role === 'admin') {
            localStorage.setItem('admin_token', response.data.token);
            localStorage.setItem('admin_data', JSON.stringify(response.data.user));
        } else if (response.data.user.role !== 'admin') {
            throw new Error('Access denied. Admin only.');
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
    }
};
