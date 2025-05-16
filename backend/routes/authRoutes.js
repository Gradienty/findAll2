const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// === Регистрация ===
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existing = await User.findUserByEmail(email);
        if (existing) return res.status(400).json({ error: 'Email уже зарегистрирован' });

        const user = await User.createUser(email, password);
        res.status(201).json({ message: 'Регистрация прошла успешно', user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error('Ошибка регистрации:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// === Вход ===
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.validatePassword(email, password);
        if (!user) return res.status(401).json({ error: 'Неверные учетные данные' });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Ошибка входа:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
