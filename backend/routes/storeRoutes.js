const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

// GET /api/stores — получить список всех магазинов
router.get('/', async (req, res) => {
    try {
        const stores = await Store.getAllStores();
        res.json(stores);
    } catch (err) {
        console.error('Ошибка при получении магазинов:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// GET /api/stores/:id — получить магазин по ID
router.get('/:id', async (req, res) => {
    try {
        const store = await Store.getStoreById(req.params.id);
        if (!store) {
            return res.status(404).json({ error: 'Магазин не найден' });
        }
        res.json(store);
    } catch (err) {
        console.error('Ошибка при получении магазина:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// POST /api/stores — создать магазин (например, админ)
router.post('/', async (req, res) => {
    try {
        const { name, base_url, api_type, description } = req.body;
        const newStore = await Store.createStore({ name, base_url, api_type, description });
        res.status(201).json(newStore);
    } catch (err) {
        console.error('Ошибка при создании магазина:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// DELETE /api/stores/:id — удалить магазин
router.delete('/:id', async (req, res) => {
    try {
        await Store.deleteStore(req.params.id);
        res.status(204).end();
    } catch (err) {
        console.error('Ошибка при удалении магазина:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
