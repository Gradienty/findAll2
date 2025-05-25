const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Регистрация
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь уже существует' });
        }

        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, is_verified) VALUES ($1, $2, $3) RETURNING id, email',
            [email, hash, false]
        );

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query(
            'INSERT INTO email_verification (email, code, expires_at) VALUES ($1, $2, $3)',
            [email, verificationCode, expiresAt]
        );

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Код подтверждения регистрации',
            text: `Ваш код подтверждения: ${verificationCode}`,
        });

        res.json({ message: 'Код подтверждения отправлен на email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка регистрации' });
    }
});

// Вход
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) return res.status(401).json({ error: 'Неверный email' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Неверный пароль' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка входа' });
    }
});

// Подтверждение email
router.post('/verify-email', async (req, res) => {
    const { email, code } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM email_verification WHERE email = $1 AND code = $2 AND expires_at > NOW()',
            [email, code]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Неверный или истекший код' });
        }

        await pool.query('UPDATE users SET is_verified = true WHERE email = $1', [email]);
        await pool.query('DELETE FROM email_verification WHERE email = $1', [email]);

        res.json({ message: 'Email подтвержден' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка подтверждения email' });
    }
});

// 🔥 Получение текущего пользователя
router.get('/me', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Токен не предоставлен' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const result = await pool.query(
            'SELECT id, email, created_at, is_verified FROM users WHERE id = $1',
            [decoded.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(403).json({ error: 'Недопустимый токен' });
    }
});

module.exports = router;
