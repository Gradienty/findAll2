import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = (email, password) =>
    axios.post(`${API_URL}/register`, { email, password });

export const login = (email, password) =>
    axios.post(`${API_URL}/login`, { email, password });

export const getUserProfile = (token) =>
    axios.get('http://localhost:5000/api/auth/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
export const verifyEmail = (email, code) =>
    axios.post('http://localhost:5000/api/auth/verify-email', { email, code });

export const resendCode = (email) =>
    axios.post('http://localhost:5000/api/auth/resend-code', { email });



