import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Товары
export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
};

// Категории
export const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
};

export const getCategoryById = async (id) => {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
};