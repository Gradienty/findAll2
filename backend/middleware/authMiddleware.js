const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'Нет токена' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // Убедись, что req.user инициализирован
        next();
    } catch (err) {
        console.error('Ошибка в middleware аутентификации:', err);
        res.status(403).json({ error: 'Неверный токен' });
    }
};

