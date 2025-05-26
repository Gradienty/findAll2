import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import { getUserProfile, changePassword } from '../api/auth';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordChanged, setPasswordChanged] = useState(false);

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

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await changePassword(currentPassword, newPassword);
            setPasswordChanged(true);
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            alert(err.response?.data?.error || 'Ошибка при смене пароля');
        }
    };

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

            <hr style={{ margin: '20px 0' }} />
            <h3>Смена пароля</h3>
            {passwordChanged && <p style={{ color: 'green' }}>Пароль успешно обновлён</p>}
            <form onSubmit={handlePasswordChange}>
                <input
                    type="password"
                    placeholder="Текущий пароль"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                /><br />
                <input
                    type="password"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                /><br />
                <button type="submit">Изменить пароль</button>
            </form>
        </div>
    );
};

export default ProfilePage;
