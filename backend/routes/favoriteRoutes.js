const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticate = require('../middleware/authMiddleware');

// Получить избранное пользователя
router.get('/:userId', authenticate, async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const result = await pool.query(
            'SELECT product_id FROM favorites WHERE user_id = $1',
            [userId]
        );
        const productIds = result.rows.map(row => row.product_id);
        res.json(productIds);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при загрузке избранного' });
    }
});

// Добавить или удалить товар из избранного
router.post('/', authenticate, async (req, res) => {
    const { product_id } = req.body;
    const userId = req.user.id;

    try {
        const check = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2',
            [userId, product_id]
        );

        if (check.rows.length > 0) {
            await pool.query(
                'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2',
                [userId, product_id]
            );
            return res.json({ status: 'removed' });
        } else {
            await pool.query(
                'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2)',
                [userId, product_id]
            );
            return res.json({ status: 'added' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при обновлении избранного' });
    }
});

module.exports = router;
