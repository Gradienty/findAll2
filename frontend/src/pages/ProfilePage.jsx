import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import { getUserProfile } from '../api/auth';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = getToken();
                const res = await getUserProfile(token);
                setUser(res.data);
            } catch (err) {
                console.error('Ошибка получения данных профиля:', err);
                setError('Не удалось загрузить профиль. Возможно, вы не авторизованы.');
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return (
            <div style={{ maxWidth: '600px', margin: '30px auto', color: 'red' }}>
                <h2>Личный кабинет</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!user) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Загрузка...</p>;

    return (
        <div style={{ maxWidth: '600px', margin: '30px auto' }}>
            <h2>Личный кабинет</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Дата регистрации:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            <p><strong>Подтверждение email:</strong> {user.is_verified ? '✅ Подтвержден' : '❌ Не подтвержден'}</p>
        </div>
    );
};

export default ProfilePage;
