const pool = require('../config/db');

// Получить все уведомления пользователя
async function getNotificationsByUser(userId) {
    const result = await pool.query(
        `SELECT n.*, p.title AS product_title
     FROM notifications n
     JOIN products p ON p.id = n.product_id
     WHERE n.user_id = $1`,
        [userId]
    );
    return result.rows;
}

// Создать уведомление
async function createNotification({ user_id, product_id, type, threshold }) {
    const result = await pool.query(
        `INSERT INTO notifications (user_id, product_id, type, threshold)
     VALUES ($1, $2, $3, $4) RETURNING *`,
        [user_id, product_id, type, threshold]
    );
    return result.rows[0];
}

// Удалить уведомление
async function deleteNotification(id) {
    await pool.query(`DELETE FROM notifications WHERE id = $1`, [id]);
}

module.exports = {
    getNotificationsByUser,
    createNotification,
    deleteNotification,
};
