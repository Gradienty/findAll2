import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { saveToken } from '../utils/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(email, password);
            saveToken(res.data.token);
            window.location.reload(); // 🔁 перезагружаем страницу
        } catch (err) {
            alert('Ошибка входа. Проверьте данные.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                /><br />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                /><br />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default LoginPage;
