import React from 'react';

export default function ProductDetail({ product, onBack }) {
    return (
        <div className="product-detail">
            <button onClick={onBack}>
                ← Вернуться к каталогу
            </button>

            <h2>{product.name}</h2>
            <img src={`/assets/images/${product.image}`} alt={product.name} />

            <p className="price">{product.price.toLocaleString()} ₽</p>

            <section className="specs">
                <h3>Характеристики:</h3>
                <ul>
                    {Object.entries(product.specs || {}).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}</strong>: {value}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="stores">
                <h3>Где купить:</h3>
                <ul>
                    {product.stores?.map((store, idx) => (
                        <li key={idx}>
                            <a href={store.url} target="_blank" rel="noopener noreferrer">
                                {store.name}: {store.store_price.toLocaleString()} ₽
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}