import { jwtDecode } from 'jwt-decode';

export function getToken() {
    return localStorage.getItem('token');
}

export function saveToken(token) {
    localStorage.setItem('token', token);
}

export function logout() {
    localStorage.removeItem('token');
}

export function getCurrentUser() {
    const token = getToken();
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
}
