import React from 'react';

export default function ComparePage({ products = [] }) {
    if (!products.length) {
        return <p style={{ color: 'white', padding: '20px' }}>Выберите товары из одной категории для сравнения.</p>;
    }

    const allKeys = [...new Set(products.flatMap(p => Object.keys(p.specs)))];

    return (
        <div style={{
            minHeight: '100vh',

            color: '#fff',
            padding: '40px'
        }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', textAlign: 'center', color: '#a084e8' }}>
                📊 Сравнение товаров
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1c1b3a', borderRadius: '12px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: '#2c2a5f' }}>
                <tr>
                    <th style={{ padding: '1rem', color: '#a084e8' }}>Характеристика</th>
                    {products.map(p => (
                        <th key={p.id} style={{ padding: '1rem', color: '#a084e8' }}>{p.title}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {allKeys.map(key => (
                    <tr key={key}>
                        <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{key}</td>
                        {products.map(p => (
                            <td key={`${p.id}-${key}`} style={{ padding: '0.75rem', textAlign: 'center' }}>
                                {p.specs[key] || '—'}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
