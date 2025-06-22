import React from 'react';

export default function Home({ onCatalogClick }) {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif',
                color: '#fff',
            }}
        >
            <h1
                style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: '#a084e8',
                    marginBottom: '1rem',
                    textShadow: '0 0 10px rgba(160, 132, 232, 0.3)',
                }}
            >
                Добро пожаловать в <span style={{ color: '#fff' }}>НайдемВСЕ</span>
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '600px', color: '#ccc' }}>
                Поиск товаров по цене, характеристикам и магазинам. Умное сравнение, избранное, отзывы и больше — всё в одном месте.
            </p>

            <button
                onClick={onCatalogClick}
                style={{
                    padding: '12px 28px',
                    background: '#6a00f4',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: '0 0 12px rgba(160, 132, 232, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#a084e8')}
                onMouseOut={e => (e.currentTarget.style.background = '#6a00f4')}
            >
                Перейти в каталог
            </button>
        </div>
    );
}
