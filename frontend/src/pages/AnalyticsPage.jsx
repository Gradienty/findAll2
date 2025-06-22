import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
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
        <div style={{
            minHeight: '100vh',
            padding: '40px 30px',
            color: '#fff',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                background: '#1e1b2e',
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '30px',
                boxShadow: '0 0 25px rgba(160, 132, 232, 0.25)',
                textAlign: 'center'
            }}>
                <h2 style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '1.8rem',
                    color: '#a084e8'
                }}>
                    <FaChartBar style={{ marginRight: '10px' }} /> Аналитика просмотров
                </h2>
                <p style={{ color: '#ccc', marginTop: '10px' }}>
                    Топ самых просматриваемых товаров за всё время.
                </p>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: '#aaa' }}>Загрузка...</p>
            ) : error ? (
                <p style={{ textAlign: 'center', color: 'tomato' }}>{error}</p>
            ) : data.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#aaa' }}>Нет данных для отображения.</p>
            ) : (
                <div style={{
                    background: '#1c1b3a',
                    padding: '20px',
                    borderRadius: '16px',
                    boxShadow: '0 0 15px rgba(160,132,232,0.2)'
                }}>
                    <ResponsiveContainer width="100%" height={600}>
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis type="number" allowDecimals={false} stroke="#ccc" />
                            <YAxis dataKey="title" type="category" width={200} stroke="#ccc" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#2e2b4f',
                                    border: '1px solid #888',
                                    color: '#fff'
                                }}
                                formatter={(value) => [`${value} просмотров`, 'Просмотры']}
                            />
                            <Bar dataKey="views" fill="#a084e8" radius={[0, 10, 10, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default AnalyticsPage;
