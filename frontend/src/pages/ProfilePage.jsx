import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getCurrentUser, getToken } from '../utils/auth';
import { FaTrashAlt, FaHeart, FaScroll, FaUserCircle } from 'react-icons/fa';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetch = async () => {
            const token = getToken();
            const current = getCurrentUser();

            if (!token || !current) return setError('Вы не авторизованы');

            try {
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);

                const favRes = await axios.get('http://localhost:5000/api/favorites/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const fullProducts = await Promise.all(
                    favRes.data.map(id =>
                        axios.get(`http://localhost:5000/api/products/${id}`)
                            .then(r => r.data)
                            .catch(() => null)
                    )
                );

                setFavorites(fullProducts.filter(Boolean));

                const reqRes = await axios.get(`http://localhost:5000/api/requests/${current.id}`);
                setRequests(reqRes.data);
            } catch (err) {
                console.error(err);
                setError('Ошибка загрузки профиля');
            }
        };

        fetch();
    }, []);

    const handleRemoveFavorite = async (id) => {
        try {
            await axios.post('http://localhost:5000/api/favorites', { product_id: id }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setFavorites(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Ошибка удаления:', err);
        }
    };

    if (error) return <div style={styles.error}>{error}</div>;
    if (!user) return <div style={styles.loading}>Загрузка...</div>;

    return (
        <main style={styles.container}>
            <h2 style={styles.heading}><FaUserCircle style={{ marginRight: 8 }} /> Профиль</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Зарегистрирован:</strong> {new Date(user.created_at).toLocaleDateString()}</p>

            <hr style={styles.divider} />

            <h3 style={styles.subheading}><FaHeart style={{ marginRight: 8 }} /> Избранное</h3>
            {favorites.length === 0 ? (
                <p>Нет избранных товаров.</p>
            ) : (
                <div style={styles.grid}>
                    {favorites.map(p => (
                        <div key={p.id} style={styles.card}>
                            <img src={p.image_url} alt={p.title} style={styles.image} />
                            <h4>{p.title}</h4>
                            <p>{p.price} ₽</p>
                            <button onClick={() => handleRemoveFavorite(p.id)} style={styles.deleteBtn}>
                                <FaTrashAlt style={{ marginRight: 5 }} /> Удалить
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <hr style={styles.divider} />

            <h3 style={styles.subheading}><FaScroll style={{ marginRight: 8 }} /> История запросов</h3>
            {requests.length === 0 ? (
                <p>Запросов пока нет.</p>
            ) : (
                <ul>
                    {requests.map(r => (
                        <li key={r.id} style={{ marginBottom: '10px' }}>
                            <strong>{r.title_query}</strong> — {r.price_max} ₽ — <em>{r.category}</em> — {new Date(r.created_at).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

const styles = {
    container: {
        padding: '40px',
        fontFamily: 'Segoe UI, sans-serif',
        color: '#fff',
        minHeight: '100vh',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center'
    },
    subheading: {
        fontSize: '1.4rem',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center'
    },
    divider: {
        borderColor: '#444',
        margin: '30px 0'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '20px'
    },
    card: {
        background: '#1c1533',
        padding: '16px',
        borderRadius: '12px',
        textAlign: 'center'
    },
    image: {
        width: '100%',
        borderRadius: '8px',
        objectFit: 'cover',
        marginBottom: '10px'
    },
    deleteBtn: {
        background: '#ff4081',
        color: '#fff',
        border: 'none',
        padding: '10px',
        borderRadius: '10px',
        cursor: 'pointer',
        marginTop: '10px'
    },
    error: {
        color: 'tomato',
        textAlign: 'center',
        marginTop: '40px'
    },
    loading: {
        color: '#fff',
        textAlign: 'center',
        marginTop: '40px'
    }
};

export default ProfilePage;
