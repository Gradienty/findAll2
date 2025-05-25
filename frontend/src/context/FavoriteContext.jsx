import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { getCurrentUser, getToken } from '../utils/auth';

const FavoriteContext = createContext();
export const useFavorites = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [user, setUser] = useState(null);

    // Инициализируем пользователя после загрузки токена
    useEffect(() => {
        const u = getCurrentUser();
        if (u && u.id) {
            setUser(u);
            console.log('✅ Пользователь инициализирован:', u);
        } else {
            console.warn('⚠️ Пользователь не найден (токен повреждён или отсутствует)');
        }
    }, []);

    // Загружаем избранное с сервера
    useEffect(() => {
        if (user?.id) {
            const loadFavorites = async () => {
                try {
                    console.log('🔄 Загружаем избранное для user_id:', user.id);
                    const res = await axios.get(`http://localhost:5000/api/favorites/${user.id}`, {
                        headers: { Authorization: `Bearer ${getToken()}` }
                    });
                    setFavorites(res.data);
                    console.log('✅ Избранное получено:', res.data);
                } catch (err) {
                    console.error('❌ Ошибка загрузки избранного:', err);
                }
            };
            loadFavorites();
        }
    }, [user]);

    const toggleFavorite = async (productId) => {
        console.log('🟡 Нажата кнопка избранного, товар:', productId);
        if (!user?.id) {
            console.warn('⚠️ Пользователь не авторизован — избранное недоступно');
            return;
        }

        try {
            const res = await axios.post(
                'http://localhost:5000/api/favorites',
                { product_id: productId },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            console.log('📩 Ответ от сервера избранного:', res.data);

            setFavorites((prev) =>
                res.data.status === 'added'
                    ? [...prev, productId]
                    : prev.filter((id) => id !== productId)
            );
        } catch (err) {
            console.error('❌ Ошибка при обновлении избранного:', err);
        }
    };

    return (
        <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};
