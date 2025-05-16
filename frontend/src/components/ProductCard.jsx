// frontend/src/components/ProductCard.jsx
import React from 'react';

export default function ProductCard({ product, onProductClick }) {
    return (
        <div
            onClick={() => onProductClick("product-detail", product)}
            style={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <img
                src={`/assets/images/${product.image}`}
                alt={product.name}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />

            <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{product.name}</h3>
                <p style={{ color: '#555', marginBottom: '0.5rem' }}>{product.description?.slice(0, 80)}...</p>
                <p style={{ fontWeight: 'bold', color: '#222' }}>{product.price.toLocaleString()} ₽</p>
            </div>
        </div>
    );
}