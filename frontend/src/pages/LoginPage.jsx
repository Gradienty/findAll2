import React, { useState } from 'react';
import axios from 'axios';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            saveToken(res.data.token);
            navigate('/');
        } catch (err) {
            alert('Ошибка входа');
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Вход</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                /><br /><br />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                /><br /><br />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default LoginPage;
