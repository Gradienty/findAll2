const express = require('express');
const router = express.Router();
const pool = require('../config/db');

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

// 🔥 Фильтрация
router.post('/filter', async (req, res) => {
    const { category_id, price_max, brand, characteristics } = req.body;

    try {
        let query = 'SELECT * FROM products WHERE category_id = $1 AND price <= $2';
        let values = [category_id, price_max];
        let index = 3;

        if (brand) {
            query += ` AND brand ILIKE $${index}`;
            values.push(`%${brand}%`);
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
