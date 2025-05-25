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
            window.location.reload(); // полная перезагрузка
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
            <div>
                {location.pathname !== '/' && (
                    <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
                        ← На главную
                    </Link>
                )}
                <Link to="/profile" style={{ color: 'white', marginRight: '20px' }}>
                    Профиль
                </Link>

                <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Каталог</Link>
                <Link to="/favorites" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
                    Избранное ({favorites.length})
                </Link>
                <Link to="/compare" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
                    Сравнение ({compareIds.length})
                </Link>
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
