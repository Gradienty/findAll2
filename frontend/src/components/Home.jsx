import React from 'react';

export default function Home({ onCatalogClick }) {
    return (
        <section className="home-section">
            <h1>Добро пожаловать в НайдемВСЕ</h1>
            <p>Поиск товаров по цене, характеристикам и магазинам</p>
            <button onClick={onCatalogClick}>Перейти в каталог</button>
        </section>
    );
}