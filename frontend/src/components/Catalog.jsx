import React, { useEffect, useState } from 'react';
import axios from 'axios';

const categoryOptions = [
    { id: 1, name: 'Смартфоны' },
    { id: 2, name: 'Ноутбуки' }
];

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // Фильтрация
    const [categoryId, setCategoryId] = useState(1);
    const [filters, setFilters] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});
    const [priceMax, setPriceMax] = useState(50000);
    const [brand, setBrand] = useState('');

    // Загрузка всех товаров при старте
    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Ошибка при загрузке товаров:', err);
        }
    };

    const fetchFilters = async (catId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/filters/${catId}`);
            setFilters(res.data);
            setSelectedFilters({});
        } catch (err) {
            console.error('Ошибка при загрузке фильтров:', err);
        }
    };

    const handleCheckboxChange = (key, value) => {
        setSelectedFilters((prev) => {
            const values = prev[key] || [];
            if (values.includes(value)) {
                return { ...prev, [key]: values.filter((v) => v !== value) };
            } else {
                return { ...prev, [key]: [...values, value] };
            }
        });
    };

    const handleFilterSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/products/filter', {
                category_id: categoryId,
                price_max: priceMax,
                brand,
                characteristics: selectedFilters
            });
            setProducts(res.data);
            setShowFilters(false); // Закрыть фильтры после применения
        } catch (err) {
            console.error('Ошибка при фильтрации:', err);
        }
    };

    const toggleFilterPanel = () => {
        setShowFilters(!showFilters);
        fetchFilters(categoryId);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '10px' }}>Каталог</h2>
            <button onClick={toggleFilterPanel} style={{ marginBottom: '20px' }}>
                {showFilters ? 'Скрыть фильтры' : 'Открыть фильтры'}
            </button>

            {showFilters && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        width: '300px',
                        height: '100%',
                        backgroundColor: '#f4f4f4',
                        borderLeft: '1px solid #ccc',
                        padding: '20px',
                        zIndex: 999
                    }}
                >
                    <h3>Фильтры</h3>
                    <button onClick={() => setShowFilters(false)} style={{ float: 'right' }}>✕</button>

                    <label>Категория:</label>
                    <select
                        value={categoryId}
                        onChange={(e) => {
                            const id = Number(e.target.value);
                            setCategoryId(id);
                            fetchFilters(id);
                        }}
                        style={{ width: '100%', marginBottom: '10px' }}
                    >
                        {categoryOptions.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <label>Максимальная цена: {priceMax} ₽</label>
                    <input
                        type="range"
                        min="1000"
                        max="100000"
                        step="1000"
                        value={priceMax}
                        onChange={(e) => setPriceMax(Number(e.target.value))}
                        style={{ width: '100%' }}
                    />

                    <label>Бренд:</label>
                    <input
                        type="text"
                        placeholder="например Samsung"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />

                    {Object.entries(filters).map(([key, values]) => (
                        <div key={key} style={{ marginBottom: '10px' }}>
                            <strong>{key}:</strong>
                            {values.map((val) => (
                                <label key={val} style={{ display: 'block' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters[key]?.includes(val) || false}
                                        onChange={() => handleCheckboxChange(key, val)}
                                    />
                                    {val}
                                </label>
                            ))}
                        </div>
                    ))}

                    <button onClick={handleFilterSubmit} style={{ marginTop: '10px' }}>
                        Применить фильтр
                    </button>
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                {products.length === 0 ? (
                    <p>Нет товаров.</p>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '20px'
                        }}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                    borderRadius: '8px'
                                }}
                            >
                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                    style={{
                                        width: '100%',
                                        height: '160px',
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                    }}
                                />
                                <h4>{product.title}</h4>
                                <p>{product.price} ₽</p>
                                <p style={{ fontSize: '14px', color: '#777' }}>{product.brand}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;
