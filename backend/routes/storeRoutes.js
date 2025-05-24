const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Получить все магазины
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM stores');
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении магазинов:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 🔍 Получить магазины, где есть товар
router.get('/by-product/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const result = await pool.query(`
      SELECT s.name, o.store_price, o.url
      FROM store_offers o
      JOIN stores s ON s.id = o.store_id
      WHERE o.product_id = $1
    `, [productId]);

        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении предложений магазинов:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
