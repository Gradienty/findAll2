const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const pool = require('../config/db');

// Получить все отзывы по товару
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.getReviewsByProduct(req.params.productId);
        res.json(reviews);
    } catch (err) {
        console.error('Ошибка при получении отзывов:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавить отзыв (требуется авторизация)
router.post('/', auth, async (req, res) => {
    try {
        const { product_id, rating, content } = req.body;
        const user_id = req.user.userId;

        const newReview = await Review.createReview({
            product_id,
            user_id,
            rating,
            content,
        });

        res.status(201).json(newReview);
    } catch (err) {
        console.error('Ошибка при создании отзыва:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удалить отзыв (только автор или админ)
router.delete('/:id', auth, async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query('SELECT user_id FROM reviews WHERE id = $1', [req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Отзыв не найден' });

        const reviewUserId = result.rows[0].user_id;
        if (reviewUserId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Нет доступа для удаления' });
        }

        await Review.deleteReview(req.params.id);
        res.status(204).end();
    } catch (err) {
        console.error('Ошибка при удалении отзыва:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
