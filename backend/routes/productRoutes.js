const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 🔍 Подсказки по названию — СТАВИМ ВЫШЕ
router.get('/suggestions', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: 'Нет параметра query' });
    }

    try {
        const result = await pool.query(
            'SELECT id, title FROM products WHERE title ILIKE $1 LIMIT 5',
            [`%${query}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении подсказок:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить все товары
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при загрузке товаров:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить товар по ID
router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Ошибка при получении товара:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 🔍 ФИЛЬТРАЦИЯ товаров
router.post('/filter', async (req, res) => {
    const { category_id, price_max, search, characteristics } = req.body;

    try {
        let query = `SELECT * FROM products WHERE category_id = $1 AND price <= $2`;
        let values = [category_id, price_max];
        let index = 3;

        if (search && search.trim() !== '') {
            query += ` AND title ILIKE $${index}`;
            values.push(`%${search}%`);
            index++;
        }

        for (const [key, valArray] of Object.entries(characteristics || {})) {
            if (valArray.length > 0) {
                query += ` AND characteristics->>$${index} = ANY($${index + 1})`;
                values.push(key);
                values.push(valArray);
                index += 2;
            }
        }

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при фильтрации:', err);
        res.status(500).json({ error: 'Ошибка фильтрации' });
    }
});

module.exports = router;
