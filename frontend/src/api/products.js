import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

export const fetchAllProducts = () =>
    axios.get(API_URL);

export const fetchProductById = (id) =>
    axios.get(`${API_URL}/${id}`);

export const filterProducts = (filters) =>
    axios.post(`${API_URL}/filter`, filters);

