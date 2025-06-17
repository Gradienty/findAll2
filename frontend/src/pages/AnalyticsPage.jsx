import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products/analytics/views');
                setData(res.data);
            } catch (err) {
                console.error('Ошибка при получении аналитики:', err);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px' }}>
            <h2>📊 Аналитика по просмотрам товаров</h2>
            {loading ? (
                <p>Загрузка...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : data.length === 0 ? (
                <p>Нет данных для отображения</p>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis dataKey="title" type="category" width={150} />
                        <Tooltip />
                        <Bar dataKey="views" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default AnalyticsPage;
