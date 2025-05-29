const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Нет токена' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('🔑 decoded JWT:', decoded);
        req.user = { id: decoded.id }; // 🛠️ ИСПРАВЛЕНО — создаём объект
        next();
    } catch (err) {
        console.error('Ошибка в middleware аутентификации:', err);
        res.status(403).json({ error: 'Недопустимый токен' });
    }
};
