const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// GET /api/requests/:userId
router.get('/:userId', async (req, res) => {
    try {
        const data = await Request.getRequestsByUser(req.params.userId);
        res.json(data);
    } catch (err) {
        console.error('Ошибка при получении запросов:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// POST /api/requests
router.post('/', async (req, res) => {
    try {
        const { user_id, category, title_query, price_max, brand, characteristics } = req.body;
        const newRequest = await Request.createRequest({
            user_id,
            category,
            title_query,
            price_max,
            brand,
            characteristics,
        });
        res.status(201).json(newRequest);
    } catch (err) {
        console.error('Ошибка при создании запроса:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// DELETE /api/requests/:id
router.delete('/:id', async (req, res) => {
    try {
        await Request.deleteRequest(req.params.id);
        res.status(204).end();
    } catch (err) {
        console.error('Ошибка при удалении запроса:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
