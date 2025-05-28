const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Проверка подключения к БД
pool.query('SELECT 1')
    .then(() => console.log('✅ Подключение к БД успешно'))
    .catch(err => {
        console.error('❌ Ошибка подключения к БД:', err);
        process.exit(1);
    });

// Тестовый маршрут
app.get('/ping', (req, res) => res.send('pong'));

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/stores', require('./routes/storeRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/filters', require('./routes/filterRoutes'));

app.listen(PORT, () => {
    console.log(`🚀 Сервер работает на http://localhost:${PORT}`);
});
