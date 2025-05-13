import React from 'react';

export default function Header({ activeTab, setActiveTab }) {
    return (
        <header className="header">
            <div>
                <h1 onClick={() => setActiveTab("catalog")}>НайдемВСЕ</h1>

                <nav className="nav">
                    <button onClick={() => setActiveTab("catalog")} className={activeTab === "catalog" ? "active" : ""}>
                        Каталог
                    </button>
                    <button onClick={() => setActiveTab("compare")} className={activeTab === "compare" ? "active" : ""}>
                        Сравнение
                    </button>
                </nav>
            </div>
        </header>
    );
}