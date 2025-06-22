import React from 'react';

export default function ComparePage({ products = [] }) {
    if (!products.length) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#fff', fontSize: '1.2rem' }}>
                Выберите товары из одной категории для сравнения.
            </div>
        );
    }

    const allKeys = [...new Set(products.flatMap((p) => Object.keys(p.specs)))];

    return (
        <div style={{ minHeight: '100vh', padding: '40px', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
            <h2 style={{
                fontSize: '1.8rem',
                marginBottom: '30px',
                textAlign: 'center',
                color: '#a084e8'
            }}>
                📊 Сравнение товаров
            </h2>

            <div style={{
                overflowX: 'auto',
                borderRadius: '12px',
                boxShadow: '0 0 20px rgba(160, 132, 232, 0.2)',
                background: '#1e1b2e'
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    <thead style={{ background: '#2c2a5f' }}>
                    <tr>
                        <th style={{
                            padding: '1rem',
                            color: '#a084e8',
                            textAlign: 'left',
                            fontWeight: '600',
                            minWidth: '160px'
                        }}>Характеристика</th>
                        {products.map((p) => (
                            <th key={p.id} style={{
                                padding: '1rem',
                                color: '#a084e8',
                                fontWeight: '500',
                                textAlign: 'center'
                            }}>{p.title}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {allKeys.map((key) => (
                        <tr key={key} style={{ borderBottom: '1px solid #2d2a52' }}>
                            <td style={{
                                padding: '0.75rem',
                                fontWeight: 'bold',
                                color: '#ccc'
                            }}>{key}</td>
                            {products.map((p) => (
                                <td key={`${p.id}-${key}`} style={{
                                    padding: '0.75rem',
                                    textAlign: 'center',
                                    color: '#eee'
                                }}>
                                    {p.specs[key] || '—'}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
