const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db');

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

// Подключение роутов
const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const storeRoutes = require('./routes/storeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const requestRoutes = require('./routes/requestRoutes');
const filterRoutes = require('./routes/filterRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/filters', filterRoutes);



app.listen(PORT, () => {
    console.log(`🚀 Сервер работает на http://localhost:${PORT}`);
});
