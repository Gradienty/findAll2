import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
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
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            alert('Неверный логин или пароль');
        }
    };

    return (
        <div>
            <h2>Вход</h2>
            <form onSubmit={handleLogin}>
                <label>Email:</label><br />
                <input value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
                <label>Пароль:</label><br />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default Login;
