import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:5000/api/favorites';

export const fetchFavorites = (userId) =>
    axios.get(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const toggleFavorite = (productId) =>
    axios.post(API_URL, { product_id: productId }, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
