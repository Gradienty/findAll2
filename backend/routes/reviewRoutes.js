const express = require('express');
const router = express.Router();
const { getReviewsByProductId } = require('../models/Review');

router.get('/reviews/:productId', async (req, res) => {
    try {
        const reviews = await getReviewsByProductId(req.params.productId);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при получении отзывов' });
    }
});

module.exports = router;