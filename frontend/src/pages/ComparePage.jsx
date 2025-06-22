import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCompare } from '../context/CompareContext';
import { useNavigate } from 'react-router-dom';

const ComparePage = () => {
    const { compareIds, clearCompare } = useCompare();
    const [comparison, setComparison] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (compareIds.length !== 2) {
            navigate('/');
            return;
        }

        const fetch = async () => {
            try {
                const res = await axios.post('http://localhost:5000/api/products/by-ids', {
                    ids: compareIds,
                });
                setComparison(res.data);
            } catch (err) {
                console.error('Ошибка при сравнении:', err);
            }
        };

        fetch();
    }, [compareIds]);

    const highlight = (key) => {
        if (comparison.length < 2) return [false, false];
        const val1 = comparison[0].characteristics?.[key];
        const val2 = comparison[1].characteristics?.[key];
        if (!val1 || !val2 || val1 === val2) return [false, false];
        const num1 = parseFloat(val1.replace(/[^\d.]/g, ''));
        const num2 = parseFloat(val2.replace(/[^\d.]/g, ''));
        if (!isNaN(num1) && !isNaN(num2)) {
            return num1 > num2 ? [true, false] : [false, true];
        }
        return [false, false];
    };

    if (comparison.length !== 2) return <div style={{ color: '#fff' }}>Загрузка...</div>;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
            color: '#fff',
            padding: '40px'
        }}>
            <h2 style={{ textAlign: 'center' }}>📊 Сравнение товаров</h2>

            <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
                {comparison.map((p, i) => (
                    <div key={i} style={{ flex: 1, background: '#1e1b2e', padding: '20px', borderRadius: '16px' }}>
                        <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }} />
                        <h4>{p.title}</h4>
                        <p><strong>Цена:</strong> {p.price} ₽</p>
                        <p><strong>Бренд:</strong> {p.brand}</p>
                    </div>
                ))}
            </div>

            <h3>Характеристики</h3>
            <table style={{ width: '100%', background: '#1c1b3a', borderRadius: '12px', overflow: 'hidden', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ background: '#6a00f4' }}>
                    <th style={{ padding: '10px' }}>Параметр</th>
                    <th style={{ padding: '10px' }}>{comparison[0].title}</th>
                    <th style={{ padding: '10px' }}>{comparison[1].title}</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(comparison[0].characteristics || {}).map((key) => {
                    const [h1, h2] = highlight(key);
                    return (
                        <tr key={key}>
                            <td style={{ padding: '10px' }}>{key}</td>
                            <td style={{ padding: '10px', backgroundColor: h1 ? '#28a745' : 'transparent' }}>{comparison[0].characteristics[key]}</td>
                            <td style={{ padding: '10px', backgroundColor: h2 ? '#28a745' : 'transparent' }}>{comparison[1].characteristics[key]}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button onClick={clearCompare} style={{
                    background: '#a084e8',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    cursor: 'pointer'
                }}>
                    Очистить сравнение
                </button>
            </div>
        </div>
    );
};

export default ComparePage;
