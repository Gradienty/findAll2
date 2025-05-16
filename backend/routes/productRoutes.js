const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Получить все товары
router.get('/', async (req, res) => {
    try {
        const products = await Product.getAllProducts();
        res.json(products);
    } catch (err) {
        console.error('Ошибка при получении всех товаров:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить товар по ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        res.json(product);
    } catch (err) {
        console.error('Ошибка при получении товара:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавить товар
router.post('/', async (req, res) => {
    try {
        const product = await Product.createProduct(req.body);
        res.status(201).json(product);
    } catch (err) {
        console.error('Ошибка при создании товара:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить товар по ID
router.put('/:id', async (req, res) => {
    try {
        const updated = await Product.updateProduct(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        console.error('Ошибка при обновлении товара:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удалить товар по ID
router.delete('/:id', async (req, res) => {
    try {
        await Product.deleteProduct(req.params.id);
        res.status(204).end();
    } catch (err) {
        console.error('Ошибка при удалении товара:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Фильтрация товаров
router.post('/filter', async (req, res) => {
    try {
        const filtered = await Product.filterProducts(req.body);
        res.json(filtered);
    } catch (err) {
        console.error('Ошибка при фильтрации товаров:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
