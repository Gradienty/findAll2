const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET /api/notifications/:userId
router.get('/:userId', async (req, res) => {
    try {
        const data = await Notification.getNotificationsByUser(req.params.userId);
        res.json(data);
    } catch (err) {
        console.error('Ошибка при получении уведомлений:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// POST /api/notifications
router.post('/', async (req, res) => {
    try {
        const { user_id, product_id, type, threshold } = req.body;
        const notification = await Notification.createNotification({
            user_id,
            product_id,
            type,
            threshold,
        });
        res.status(201).json(notification);
    } catch (err) {
        console.error('Ошибка при создании уведомления:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// DELETE /api/notifications/:id
router.delete('/:id', async (req, res) => {
    try {
        await Notification.deleteNotification(req.params.id);
        res.status(204).end();
    } catch (err) {
        console.error('Ошибка при удалении уведомления:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
