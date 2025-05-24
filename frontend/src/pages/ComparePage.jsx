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
                    ids: compareIds
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

    if (comparison.length !== 2) return <div>Загрузка...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
            <h2>Сравнение товаров</h2>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                {comparison.map((p, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
                        <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                        <h4>{p.title}</h4>
                        <p><b>Цена:</b> {p.price} ₽</p>
                        <p><b>Бренд:</b> {p.brand}</p>
                    </div>
                ))}
            </div>

            <h4>Характеристики:</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Параметр</th>
                    <th style={{ padding: '8px' }}>{comparison[0].title}</th>
                    <th style={{ padding: '8px' }}>{comparison[1].title}</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(comparison[0].characteristics || {}).map(key => {
                    const [highlight0, highlight1] = highlight(key);
                    return (
                        <tr key={key}>
                            <td style={{ fontWeight: 'bold', padding: '6px' }}>{key}</td>
                            <td style={{
                                padding: '6px',
                                backgroundColor: highlight0 ? '#d4f8d4' : undefined
                            }}>{comparison[0].characteristics[key]}</td>
                            <td style={{
                                padding: '6px',
                                backgroundColor: highlight1 ? '#d4f8d4' : undefined
                            }}>{comparison[1].characteristics[key]}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <button onClick={clearCompare} style={{ marginTop: '20px' }}>
                Очистить сравнение
            </button>
        </div>
    );
};

export default ComparePage;
