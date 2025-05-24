const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Получить все товары
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении товаров:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 🔍 Получить один товар по ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Товар не найден' });
        }

        const product = result.rows[0];

        // Преобразуем JSON строку в объект
        if (typeof product.characteristics === 'string') {
            product.characteristics = JSON.parse(product.characteristics);
        }

        res.json(product);
    } catch (err) {
        console.error('Ошибка при получении товара:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
// Получить несколько товаров по ID
router.post('/by-ids', async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length !== 2) {
        return res.status(400).json({ error: 'Передай два ID в массиве' });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM products WHERE id = ANY($1::int[])`,
            [ids]
        );

        const products = result.rows.map(p => ({
            ...p,
            characteristics: typeof p.characteristics === 'string'
                ? JSON.parse(p.characteristics)
                : p.characteristics
        }));

        res.json(products);
    } catch (err) {
        console.error('Ошибка при получении сравнения:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
