import React, { useState } from 'react';
import { register } from '../api/auth';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registered, setRegistered] = useState(false);
    const [code, setCode] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            setRegistered(true);
        } catch (err) {
            alert('Ошибка регистрации. Email может быть занят.');
        }
    };

    const handleVerify = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
            if (res.ok) {
                alert('Email подтвержден. Теперь вы можете войти.');
                window.location.href = '/login';
            } else {
                alert('Неверный код.');
            }
        } catch {
            alert('Ошибка при подтверждении.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2>Регистрация</h2>
            {!registered ? (
                <form onSubmit={handleRegister}>
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
                    <button type="submit">Зарегистрироваться</button>
                </form>
            ) : (
                <>
                    <p>Введите код, отправленный на {email}:</p>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    /><br />
                    <button onClick={handleVerify}>Подтвердить</button>
                </>
            )}
        </div>
    );
};

export default RegisterPage;
