const pool = require('../config/db');

// Получить запросы по пользователю
async function getRequestsByUser(userId) {
    const result = await pool.query(
        `SELECT * FROM requests WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
}

// Добавить запрос
async function createRequest({ user_id, category, title_query, price_max, brand, characteristics }) {
    const result = await pool.query(
        `INSERT INTO requests (user_id, category, title_query, price_max, brand, characteristics)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [user_id, category, title_query, price_max, brand, characteristics]
    );
    return result.rows[0];
}

// Удалить запрос
async function deleteRequest(id) {
    await pool.query(`DELETE FROM requests WHERE id = $1`, [id]);
}

module.exports = {
    getRequestsByUser,
    createRequest,
    deleteRequest,
};
