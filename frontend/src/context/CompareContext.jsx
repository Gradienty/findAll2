import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
    const [compareIds, setCompareIds] = useState([]);

    const toggleProduct = (id) => {
        setCompareIds(prev => {
            if (prev.includes(id)) return prev.filter(pid => pid !== id);
            if (prev.length >= 2) return prev; // максимум 2
            return [...prev, id];
        });
    };

    const clearCompare = () => setCompareIds([]);

    return (
        <CompareContext.Provider value={{ compareIds, toggleProduct, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
};
