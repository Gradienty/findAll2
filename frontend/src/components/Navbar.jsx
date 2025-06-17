import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth';
import { useCompare } from '../context/CompareContext';
import { useFavorites } from '../context/FavoriteContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getCurrentUser();
    const { compareIds } = useCompare();
    const { favorites } = useFavorites();

    const handleLogout = () => {
        const confirmed = window.confirm('Вы действительно хотите выйти из аккаунта?');
        if (confirmed) {
            logout();
            window.location.reload();
        }
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#2c3e50',
            color: 'white',
            padding: '15px 30px'
        }}>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>🏠 Главная</Link>
                <Link to="/favorites" style={{ color: 'white', textDecoration: 'none' }}>❤️ Избранное ({favorites.length})</Link>
                <Link to="/compare" style={{ color: 'white', textDecoration: 'none' }}>⚖️ Сравнение ({compareIds.length})</Link>
                <Link to="/analytics" style={{ color: 'white', textDecoration: 'none' }}>📊 Аналитика</Link>
            </div>

            <div>
                {user ? (
                    <span
                        onClick={handleLogout}
                        style={{ cursor: 'pointer', color: 'white', textDecoration: 'underline' }}
                    >
            Выйти ({user.email})
          </span>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', marginRight: '20px' }}>Вход</Link>
                        <Link to="/register" style={{ color: 'white' }}>Регистрация</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
