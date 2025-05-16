const pool = require('../config/db');

// Получить все магазины
async function getAllStores() {
    const result = await pool.query('SELECT * FROM stores ORDER BY id');
    return result.rows;
}

// Получить магазин по ID
async function getStoreById(id) {
    const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
    return result.rows[0];
}

// Добавить магазин (админ)
async function createStore({ name, base_url, api_type, description }) {
    const result = await pool.query(
        `INSERT INTO stores (name, base_url, api_type, description)
     VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, base_url, api_type, description]
    );
    return result.rows[0];
}

// Удалить магазин по ID
async function deleteStore(id) {
    await pool.query('DELETE FROM stores WHERE id = $1', [id]);
}

module.exports = {
    getAllStores,
    getStoreById,
    createStore,
    deleteStore,
};
