const express = require('express');
const router = express.Router();
const Filter = require('../models/Filter');

router.get('/:categoryId', async (req, res) => {
    try {
        const filters = await Filter.getFiltersByCategory(req.params.categoryId);
        res.json(filters);
    } catch (err) {
        console.error('Ошибка при получении фильтров:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
