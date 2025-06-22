import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { FaChartBar } from 'react-icons/fa';

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
        <div style={{ minHeight: '100vh', width: '100%', padding: '30px', background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)', color: '#fff', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}>
            <div
                style={{

                    padding: '20px',
                    borderRadius: '20px',
                    marginBottom: '30px',
                    boxShadow: '0 0 15px rgba(160, 132, 232, 0.5)',
                    textAlign: 'center'
                }}
            >
                <h2 style={{ margin: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaChartBar style={{ marginRight: '10px' }} />Популярные товары по просмотрам
                </h2>
            </div>
            <p style={{ color: '#ccc', marginBottom: '20px', textAlign: 'center' }}>
                Здесь представлены самые просматриваемые товары за всё время. Это может помочь определить, что вызывает наибольший интерес у пользователей.
            </p>

            {loading ? (
                <p style={{ color: '#aaa', textAlign: 'center' }}>Загрузка...</p>
            ) : error ? (
                <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
            ) : data.length === 0 ? (
                <p style={{ color: '#aaa', textAlign: 'center' }}>Нет данных для отображения</p>
            ) : (
                <div style={{ height: '70vh' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis type="number" allowDecimals={false} stroke="#ccc" />
                            <YAxis dataKey="title" type="category" width={200} stroke="#ccc" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#222', borderColor: '#888' }}
                                formatter={(value) => [`${value} просмотров`, 'Просмотры']}
                            />
                            <Bar dataKey="views" fill="#a084e8" name="Просмотры" radius={[0, 10, 10, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default AnalyticsPage;
