const express = require('express');
const router = express.Router();

// Пример категорий
const categories = [
];

// Все категории
router.get('/', (req, res) => {
    res.json(categories);
});

// Категория по ID
router.get('/:id', (req, res) => {
    const category = categories.find(c => c.id === parseInt(req.params.id));
    if (!category) return res.status(404).json({ error: 'Категория не найдена' });
    res.json(category);
});

module.exports = router;