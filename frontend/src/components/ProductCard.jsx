import React from 'react';

export default function ProductCard({ product, onProductClick }) {
    return (
        <div
            onClick={() => onProductClick("product-detail", product)}
            style={{
                background: '#1f183a',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(160, 132, 232, 0.15)',
                cursor: 'pointer',
                transition: 'transform 0.25s ease-in-out',
                color: '#fff'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <img
                src={`/assets/images/${product.image}`}
                alt={product.name}
                style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'cover',
                    borderBottom: '1px solid #2c254a'
                }}
            />

            <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 8px' }}>{product.name}</h3>
                <p style={{ fontSize: '0.95rem', color: '#ccc', marginBottom: '10px' }}>
                    {product.description?.slice(0, 80)}...
                </p>
                <p style={{ fontWeight: 'bold', color: '#a084e8', fontSize: '1.1rem' }}>
                    {product.price.toLocaleString()} ₽
                </p>
            </div>
        </div>
    );
}
