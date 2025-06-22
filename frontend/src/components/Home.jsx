export default function Home({ onCatalogClick }) {
    return (
        <div style={{
            minHeight: '100vh',

            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
        }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#a084e8' }}>Добро пожаловать в НайдемВСЕ</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Поиск товаров по цене, характеристикам и магазинам</p>
            <button
                onClick={onCatalogClick}
                style={{
                    background: '#6a00f4',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '1rem',
                    cursor: 'pointer'
                }}
            >
                Перейти в каталог
            </button>
        </div>
    );
}
