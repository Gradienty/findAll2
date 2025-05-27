    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import { getCurrentUser, getToken } from '../utils/auth';

    const ProfilePage = () => {
        const [user, setUser] = useState(null);
        const [favorites, setFavorites] = useState([]);
        const [requests, setRequests] = useState([]);
        const [error, setError] = useState('');

        useEffect(() => {
            const fetchProfileData = async () => {
                const token = getToken();
                const current = getCurrentUser();

                if (!current || !token) {
                    setError('Вы не авторизованы');
                    return;
                }

                try {
                    // Профиль
                    const profileRes = await axios.get('http://localhost:5000/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(profileRes.data);

                    // Избранное
                    const favRes = await axios.get(`http://localhost:5000/api/favorites/${current.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // Нужно получить полные данные о товарах по их ID
                    const productDetails = await Promise.all(
                        favRes.data.map(productId =>
                            axios.get(`http://localhost:5000/api/products/${productId}`)
                                .then(r => r.data)
                                .catch(() => null)
                        )
                    );

                    setFavorites(productDetails.filter(Boolean));

                    // Запросы
                    const reqRes = await axios.get(`http://localhost:5000/api/requests/${current.id}`);
                    setRequests(reqRes.data);
                } catch (err) {
                    console.error('Ошибка загрузки профиля:', err);
                    setError('Ошибка загрузки данных профиля');
                }
            };

            fetchProfileData();
        }, []);

        const handleRemoveFavorite = async (productId) => {
            try {
                const token = getToken();
                await axios.post('http://localhost:5000/api/favorites', {
                    product_id: productId
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setFavorites(prev => prev.filter(p => p.id !== productId));
            } catch (err) {
                console.error('Ошибка удаления из избранного:', err);
            }
        };

        if (error) {
            return <div style={{ color: 'red', textAlign: 'center', marginTop: '30px' }}>{error}</div>;
        }

        if (!user) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Загрузка...</p>;

        return (
            <div style={{ maxWidth: '900px', margin: '40px auto' }}>
                <h2>Личный кабинет</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Дата регистрации:</strong> {new Date(user.created_at).toLocaleDateString()}</p>

                <hr style={{ margin: '30px 0' }} />

                <h3>❤️ Избранные товары</h3>
                {favorites.length === 0 ? (
                    <p>Нет избранных товаров.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {favorites.map(product => (
                            <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
                                <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                <h4>{product.title}</h4>
                                <p>{product.price} ₽</p>
                                <p><small>{product.brand}</small></p>
                                <button onClick={() => handleRemoveFavorite(product.id)} style={{ marginTop: '10px' }}>
                                    Удалить из избранного
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <hr style={{ margin: '30px 0' }} />

                <h3>🕵️ История запросов</h3>
                {requests.length === 0 ? (
                    <p>История запросов пуста.</p>
                ) : (
                    <ul>
                        {requests.map(r => (
                            <li key={r.id}>
                                <strong>{r.title_query}</strong> — {r.price_max} ₽ — <em>{r.category}</em> ({new Date(r.created_at).toLocaleDateString()})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    export default ProfilePage;
