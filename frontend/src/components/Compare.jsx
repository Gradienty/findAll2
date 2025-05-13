import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Compare({ comparisonList }) {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        if (comparisonList.length === 0) return;

        const fetchProducts = async () => {
            try {
                const ids = comparisonList.join(',');
                const response = await axios.get(`http://localhost:5000/api/compare/${ids}`);

                const data = response.data;

                // Проверяем, чтобы все товары были из одной категории
                const categoryIds = [...new Set(data.map(p => p.category_id))];
                if (categoryIds.length > 1) {
                    alert('Можно сравнивать только товары одной категории');
                    setProducts([]);
                    return;
                }

                setProducts(data);
                setCategory(categoryIds[0]);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, [comparisonList]);

    if (products.length === 0) {
        return <p>Выберите товары из одной категории для сравнения</p>;
    }

    const allKeys = [
        ...new Set(products.flatMap(p => Object.keys(p.specs)))
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Сравнение товаров
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th>Характеристика</th>
                    {products.map((product) => (
                        <th key={product.id} style={{ textAlign: 'center' }}>
                            {product.name}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {allKeys.map((key) => (
                    <tr key={key}>
                        <td style={{ fontWeight: 'bold' }}>{key}</td>
                        {products.map((product) => (
                            <td key={`${product.id}-${key}`} style={{ textAlign: 'center' }}>
                                {product.specs[key] || '-'}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}