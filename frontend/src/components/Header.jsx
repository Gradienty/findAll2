import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
            padding: '16px 32px',
            background: 'rgba(28, 25, 58, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            margin: '20px auto',
            maxWidth: '1200px',
            fontFamily: 'Inter, sans-serif',
            color: '#fff',
            boxShadow: '0 0 15px rgba(160, 132, 232, 0.2)'
        }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {location.pathname !== '/' && (
                    <Link to="/" style={navLinkStyle}>← На главную</Link>
                )}
                <Link to="/favorites" style={navLinkStyle}>
                    Избранное ({favorites.length})
                </Link>
                <Link to="/compare" style={navLinkStyle}>
                    Сравнение ({compareIds.length})
                </Link>
                <Link to="/profile" style={navLinkStyle}>
                    Профиль
                </Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {user ? (
                    <span
                        onClick={handleLogout}
                        style={{ cursor: 'pointer', color: '#a084e8', textDecoration: 'underline' }}
                    >
            Выйти ({user.email})
          </span>
                ) : (
                    <>
                        <Link to="/login" style={navLinkStyle}>Вход</Link>
                        <Link to="/register" style={navLinkStyle}>Регистрация</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

const navLinkStyle = {
    color: '#a084e8',
    fontWeight: 500,
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.2s ease',
};

export default Navbar;
