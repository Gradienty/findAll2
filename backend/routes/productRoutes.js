const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 🔹 Получить все товары
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при загрузке товаров:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 🔹 Получить товар по ID с предложениями из магазинов
router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const productRes = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
        if (productRes.rows.length === 0) {
            return res.status(404).json({ error: 'Товар не найден' });
        }

        const product = productRes.rows[0];

        const offersRes = await pool.query(
            `SELECT so.store_price, so.url, s.name AS store_name
             FROM store_offers so
             JOIN stores s ON s.id = so.store_id
             WHERE so.product_id = $1`,
            [productId]
        );

        product.offers = offersRes.rows;
        res.json(product);
    } catch (err) {
        console.error('Ошибка при получении товара:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 🔍 Подсказки по названию товара
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

// 🔎 Фильтрация товаров
router.post('/filter', async (req, res) => {
    const { category_id, price_max, search, characteristics } = req.body;

    try {
        let query = `SELECT * FROM products WHERE 1=1`;
        const values = [];
        let i = 1;

        if (category_id) {
            query += ` AND category_id = $${i++}`;
            values.push(category_id);
        }

        if (price_max && price_max > 0) {
            query += ` AND price <= $${i++}`;
            values.push(price_max);
        }

        if (search && search.trim() !== '') {
            query += ` AND title ILIKE $${i++}`;
            values.push(`%${search}%`);
        }

        if (characteristics && typeof characteristics === 'object') {
            for (const [key, val] of Object.entries(characteristics)) {
                if (Array.isArray(val) && val.length > 0) {
                    const orClauses = [];
                    for (const v of val) {
                        if (typeof v === 'string' && v.trim() !== '') {
                            orClauses.push(`characteristics ->> $${i++} ILIKE $${i++}`);
                            values.push(key, `%${v}%`);
                        }
                    }
                    if (orClauses.length > 0) {
                        query += ` AND (${orClauses.join(' OR ')})`;
                    }
                } else if (typeof val === 'string' && val.trim() !== '') {
                    query += ` AND characteristics ->> $${i++} ILIKE $${i++}`;
                    values.push(key, `%${val}%`);
                }
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
