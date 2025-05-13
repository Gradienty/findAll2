const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById } = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при получении товаров' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Товар не найден' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при получении товара' });
    }
});

module.exports = router;