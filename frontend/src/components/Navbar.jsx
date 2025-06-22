import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth';
import { useCompare } from '../context/CompareContext';
import { useFavorites } from '../context/FavoriteContext';
import { FaHeart, FaChartBar, FaUser, FaSignOutAlt, FaExchangeAlt } from 'react-icons/fa';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getCurrentUser();
    const { compareIds } = useCompare();
    const { favorites } = useFavorites();

    const handleLogout = () => {
        if (window.confirm('Вы действительно хотите выйти из аккаунта?')) {
            logout();
            window.location.reload();
        }
    };

    return (
        <nav
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(15, 12, 41, 0.9)',
                padding: '16px 30px',
                borderRadius: '0 0 16px 16px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                marginBottom: '20px',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {location.pathname !== '/' && (
                    <Link to="/" style={linkStyle}>
                        ⬅ Каталог
                    </Link>
                )}
                <Link to="/favorites" style={linkStyle}>
                    <FaHeart style={iconStyle} /> Избранное ({favorites.length})
                </Link>
                <Link to="/compare" style={linkStyle}>
                    <FaExchangeAlt style={iconStyle} /> Сравнение ({compareIds.length})
                </Link>
                <Link to="/analytics" style={linkStyle}>
                    <FaChartBar style={iconStyle} /> Аналитика
                </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {user ? (
                    <>
                        <Link to="/profile" style={linkStyle}>
                            <FaUser style={iconStyle} /> Профиль
                        </Link>
                        <span onClick={handleLogout} style={{ ...linkStyle, cursor: 'pointer' }}>
                            <FaSignOutAlt style={iconStyle} /> Выйти
                        </span>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={linkStyle}>Вход</Link>
                        <Link to="/register" style={linkStyle}>Регистрация</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

const linkStyle = {
    color: '#a084e8',
    textDecoration: 'none',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'color 0.3s ease',
};

const iconStyle = {
    verticalAlign: 'middle',
};

export default Navbar;
