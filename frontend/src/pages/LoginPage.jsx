import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { saveToken } from '../utils/auth';
import { FaSignInAlt } from 'react-icons/fa';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const res = await login(email, password);
            saveToken(res.data.token);
            setMessage('Успешный вход! Перенаправление...');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка входа. Проверьте данные.');
        }
    };

    return (
        <div style={styles.page}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>
                    <FaSignInAlt style={{ marginRight: 10 }} />
                    Вход
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <button type="submit">Войти</button>

                {message && <p style={styles.message}>{message}</p>}
                {error && <p style={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        background: 'rgba(30, 27, 46, 0.9)',
        padding: '30px',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 0 20px rgba(160, 132, 232, 0.3)',
        backdropFilter: 'blur(10px)'
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#2c254a',
        color: 'white',
        fontSize: '1rem'
    },
    message: {
        color: 'lime',
        marginTop: '15px',
        textAlign: 'center'
    },
    error: {
        color: 'tomato',
        marginTop: '15px',
        textAlign: 'center'
    }
};

export default LoginPage;
