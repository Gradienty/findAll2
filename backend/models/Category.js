const pool = require('../config/db');

const getAllCategories = async () => {
    const res = await pool.query('SELECT * FROM categories');
    return res.rows;
};

const getCategoryById = async (id) => {
    const res = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return res.rows[0];
};

module.exports = {
    getAllCategories,
    getCategoryById,
};