import { jwtDecode } from 'jwt-decode';

export function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return {
            id: decoded.userId,
            role: decoded.role
        };
    } catch {
        return null;
    }
}
