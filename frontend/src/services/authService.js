import { api } from './api';

export const authService = {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.token) {
            localStorage.setItem('token', response.token);
        }
        return response;
    },

    async register(name, email, password) {
        return api.post('/auth/register', { name, email, password });
    },

    async getProfile() {
        return api.get('/auth/profile');
    },

    async updateProfile(profileData) {
        return api.put('/auth/profile', profileData);
    },

    async forgotPassword(email) {
        return api.post('/auth/forgot-password', { email });
    },

    async resetPassword(email, otp, newPassword) {
        return api.post('/auth/reset-password', { email, otp, newPassword });
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};
