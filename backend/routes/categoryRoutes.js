const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Получить все категории
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories');
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка получения категорий:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
