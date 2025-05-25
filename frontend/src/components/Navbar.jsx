import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useFavorites } from '../context/FavoriteContext';
import { getCurrentUser, logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { compareIds } = useCompare();
    const { favorites } = useFavorites();
    const location = useLocation();
    const user = getCurrentUser();
    const navigate = useNavigate();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '15px 30px',
            background: '#2c3e50',
            color: 'white',
            alignItems: 'center'
        }}>
            {user ? (
                <span onClick={() => { logout(); navigate('/'); }} style={{ cursor: 'pointer' }}>
    Выйти ({user.email})
  </span>
            ) : (
                <>
                    <Link to="/login" style={{ color: 'white', marginRight: '20px' }}>Войти</Link>
                    <Link to="/register" style={{ color: 'white' }}>Регистрация</Link>
                </>
            )}

            <div>
                {/* Левая часть навигации */}
                {location.pathname !== '/' && (
                    <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
                        ← На главную
                    </Link>
                )}
                <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
                    Каталог
                </Link>
                <Link to="/favorites" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
                    Избранное ({favorites.length})
                </Link>
                <Link to="/compare" style={{ color: 'white', textDecoration: 'none' }}>
                    Сравнение ({compareIds.length})
                </Link>
            </div>

            {/* Справа можно добавить иконки, имя пользователя и пр. */}
        </nav>
    );
};

export default Navbar;
