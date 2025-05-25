import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext.jsx';

const FavoritesPage = () => {
    const { favorites, toggleFavorite } = useFavorites();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data.filter(p => favorites.includes(p.id)));
            } catch (err) {
                console.error('Ошибка при загрузке избранного:', err);
            }
        };
        load();
    }, [favorites]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Избранные товары</h2>
            {products.length === 0 ? (
                <p>Нет избранных товаров.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {products.map(product => (
                        <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                <h4>{product.title}</h4>
                                <p>{product.price} ₽</p>
                            </Link>
                            <button onClick={() => toggleFavorite(product.id)}>
                                {favorites.includes(product.id) ? '💔 Удалить' : '💖 В избранное'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
