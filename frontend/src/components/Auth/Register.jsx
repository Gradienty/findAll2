import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                email,
                password
            });
            navigate('/login');
        } catch (err) {
            alert('Ошибка регистрации');
        }
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister}>
                <label>Email:</label><br />
                <input value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
                <label>Пароль:</label><br />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default Register;
