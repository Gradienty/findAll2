import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import axios from 'axios';

const FavoriteContext = createContext();
export const useFavorites = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Загрузка избранного при загрузке компонента
    useEffect(() => {
        const token = getToken();
        if (!token) return;

        axios.get('http://localhost:5000/api/favorites/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setFavorites(res.data))
            .catch(err => console.error('Ошибка загрузки избранного:', err));
    }, []);

    const toggleFavorite = async (productId) => {
        const token = getToken();
        if (!token) {
            alert('Войдите в аккаунт, чтобы использовать избранное');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/favorites', {
                product_id: productId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFavorites(prev =>
                res.data.status === 'added'
                    ? [...prev, productId]
                    : prev.filter(id => id !== productId)
            );
        } catch (err) {
            console.error('Ошибка при обновлении избранного:', err);
        }
    };

    return (
        <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};
