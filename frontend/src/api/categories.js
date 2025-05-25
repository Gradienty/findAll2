import axios from 'axios';

const API_URL = 'http://localhost:5000/api/categories';

export const fetchCategories = () =>
    axios.get(API_URL);
