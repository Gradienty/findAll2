import React, { useState } from 'react';
import { register, verifyEmail, resendCode } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState('register'); // 'register' | 'verify'
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(email, password);
            setStep('verify');
            setMessage('Письмо с кодом отправлено. Введите код ниже.');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка регистрации');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await verifyEmail(email, code);
            setMessage('✅ Email подтверждён. Теперь вы можете войти.');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка подтверждения');
        }
    };

    const handleResend = async () => {
        setError('');
        try {
            await resendCode(email);
            setMessage('Новый код отправлен на почту.');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка при повторной отправке');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto' }}>
            <h2>Регистрация</h2>

            {step === 'register' && (
                <form onSubmit={handleRegister}>
                    <label>Email:</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />

                    <label>Пароль:</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />

                    <button type="submit" style={{ width: '100%', padding: '10px' }}>
                        Зарегистрироваться
                    </button>
                </form>
            )}

            {step === 'verify' && (
                <form onSubmit={handleVerify}>
                    <label>Введите код из письма:</label>
                    <input
                        type="text"
                        required
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />

                    <button type="submit" style={{ width: '100%', padding: '10px' }}>
                        Подтвердить
                    </button>

                    <button type="button" onClick={handleResend} style={{ marginTop: '10px', width: '100%', padding: '10px' }}>
                        Отправить код повторно
                    </button>
                </form>
            )}

            {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
        </div>
    );
};

export default RegisterPage;
