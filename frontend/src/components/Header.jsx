// frontend/src/components/Header.jsx
import React from 'react';

export default function Header({ activeTab, setActiveTab }) {
    return (
        <header style={{
            backgroundColor: '#fff',
            borderBottom: '1px solid #E5E7EB',
            padding: '1rem 2rem'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1
                    onClick={() => setActiveTab("catalog")}
                    style={{
                        fontSize: '1.5rem',
                        color: '#6366F1',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    НайдемВСЕ
                </h1>

                <nav style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setActiveTab("catalog")}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === "catalog" ? "#6366F1" : "#222",
                            fontWeight: activeTab === "catalog" ? "bold" : "normal",
                            cursor: 'pointer'
                        }}
                    >
                        Каталог
                    </button>

                    <button
                        onClick={() => setActiveTab("compare")}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === "compare" ? "#6366F1" : "#222",
                            fontWeight: activeTab === "compare" ? "bold" : "normal",
                            cursor: 'pointer'
                        }}
                    >
                        Сравнение
                    </button>
                </nav>
            </div>
        </header>
    );
}