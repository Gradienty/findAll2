import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await register(email, password);
            setMessage('Регистрация прошла успешно!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка регистрации');
        }
    };

    return (
        <main style={styles.page}>
            <form onSubmit={handleRegister} style={styles.form}>
                <h2 style={styles.title}>
                    <FaUserPlus style={{ marginRight: 10, color: '#fff' }} />
                    Регистрация
                </h2>

                <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    style={styles.input}
                />

                <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Пароль"
                    style={styles.input}
                />

                <button type="submit">Зарегистрироваться</button>

                {message && <p style={styles.message}>{message}</p>}
                {error && <p style={styles.error}>{error}</p>}
            </form>
        </main>
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

export default RegisterPage;
