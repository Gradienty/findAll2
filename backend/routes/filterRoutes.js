const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Получить фильтры по category_id
router.get('/:categoryId', async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);

    try {
        const result = await pool.query(
            'SELECT characteristics FROM products WHERE category_id = $1',
            [categoryId]
        );

        const all = result.rows.map(row => row.characteristics || {});
        const merged = {};

        for (const charObj of all) {
            for (const [key, value] of Object.entries(charObj)) {
                if (!merged[key]) merged[key] = new Set();
                merged[key].add(value);
            }
        }

        const output = {};
        for (const key in merged) {
            output[key] = Array.from(merged[key]);
        }

        res.json(output);
    } catch (err) {
        console.error('Ошибка при получении фильтров:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
