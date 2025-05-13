import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function Catalog({ onProductClick }) {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'iPhone 15 Pro',
            description: 'Флагманский смартфон Apple...',
            price: 99990,
            image: 'iPhone_15_Pro.jpg',
            rating: 4.8,
            category_id: 1
        },
        {
            id: 2,
            name: 'Samsung Galaxy S23 Ultra',
            description: 'Флагман Android...',
            price: 119990,
            image: 'Samsung_Galaxy_S23_Ultra.jpg',
            rating: 4.7,
            category_id: 1
        }
    ]);

    // Если API доступен — замени моковые данные
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('API недоступен, используем моковые данные');
            }
        };

        fetch();
    }, []);

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Каталог товаров</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1.5rem'
            }}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
                    ))
                ) : (
                    <p>Нет товаров</p>
                )}
            </div>
        </div>
    );
}