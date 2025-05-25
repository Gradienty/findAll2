import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, getToken } from '../utils/auth';
import { fetchFavorites, toggleFavorite as toggleFavoriteAPI } from '../api/favorites';

const FavoriteContext = createContext();
export const useFavorites = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const u = getCurrentUser();
        if (u && u.id) {
            setUser(u);
        }
    }, []);

    useEffect(() => {
        if (user?.id) {
            fetchFavorites(user.id)
                .then(res => setFavorites(res.data))
                .catch(err => console.error('Ошибка загрузки избранного:', err));
        }
    }, [user]);

    const toggleFavorite = async (productId) => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            alert('Войдите в аккаунт, чтобы использовать избранное');
            return;
        }

        try {
            const res = await toggleFavoriteAPI(productId);
            setFavorites((prev) =>
                res.data.status === 'added'
                    ? [...prev, productId]
                    : prev.filter((id) => id !== productId)
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
