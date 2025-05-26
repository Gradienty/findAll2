import React, { useState } from 'react';
import { verifyEmail, resendCode } from '../api/auth';

const EmailVerification = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [resendSuccess, setResendSuccess] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await verifyEmail(email, code);
            setMessage(res.data.message);
            setIsVerified(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Ошибка подтверждения');
        }
    };

    const handleResend = async () => {
        setError('');
        setMessage('');
        setResendSuccess('');
        try {
            const res = await resendCode(email);
            setResendSuccess(res.data.message);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Ошибка при отправке кода');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Подтверждение Email</h2>
            <form onSubmit={handleVerify}>
                <label>Email:</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />

                <label>Код подтверждения:</label>
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
            </form>

            <button onClick={handleResend} style={{ marginTop: '15px', padding: '10px', width: '100%' }}>
                Отправить код повторно
            </button>

            {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
            {resendSuccess && <p style={{ color: 'blue', marginTop: '10px' }}>{resendSuccess}</p>}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            {isVerified && (
                <p style={{ color: 'green', marginTop: '20px' }}>
                    ✅ Email подтверждён. Вы можете войти в систему.
                </p>
            )}
        </div>
    );
};

export default EmailVerification;
