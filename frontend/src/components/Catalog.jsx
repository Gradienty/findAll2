import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useFavorites } from '../context/FavoriteContext';

const categoryOptions = [
    { id: 1, name: 'Смартфоны' },
    { id: 2, name: 'Ноутбуки' },
    { id: 3, name: 'Планшеты' },
    { id: 4, name: 'Мониторы' },
    { id: 5, name: 'Наушники' },
    { id: 6, name: 'Телевизоры' }
];

const Catalog = () => {
    const [categoryId, setCategoryId] = useState(1);
    const [filters, setFilters] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});
    const [products, setProducts] = useState([]);
    const [priceMax, setPriceMax] = useState(100000);
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const location = useLocation();
    const { compareIds, toggleProduct } = useCompare();
    const { favorites, toggleFavorite } = useFavorites();
    const navigate = useNavigate();

    const searchQuery = new URLSearchParams(location.search).get('search');

    useEffect(() => {
        if (compareIds.length === 2) {
            navigate('/compare');
        }
    }, [compareIds]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/filters/${categoryId}`);
                setFilters(res.data);
                setSelectedFilters({});
            } catch (err) {
                console.error('Ошибка при загрузке фильтров:', err);
            }
        };
        fetchFilters();
    }, [categoryId]);

    const handleCheckboxChange = (key, value) => {
        setSelectedFilters(prev => {
            const values = prev[key] || [];
            if (values.includes(value)) {
                return { ...prev, [key]: values.filter(v => v !== value) };
            } else {
                return { ...prev, [key]: [...values, value] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/products/filter', {
                category_id: categoryId,
                price_max: priceMax,
                characteristics: selectedFilters
            });
            setProducts(res.data);
        } catch (err) {
            console.error('Ошибка при фильтрации:', err);
        }
    };

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const url = searchQuery
                    ? `http://localhost:5000/api/products?search=${encodeURIComponent(searchQuery)}`
                    : 'http://localhost:5000/api/products';
                const res = await axios.get(url);
                setProducts(res.data);
            } catch (err) {
                console.error('Ошибка при загрузке товаров:', err);
            }
        };
        loadProducts();
    }, [searchQuery]);

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearch(value);
        if (value.trim()) {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/suggestions?query=${value}`);
                setSuggestions(res.data);
            } catch (err) {
                console.error('Ошибка при получении подсказок:', err);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/catalog?search=${encodeURIComponent(search.trim())}`);
            setSuggestions([]);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearchSubmit} style={{ padding: '10px 30px', display: 'flex', gap: '10px', position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={search}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                    style={{ padding: '6px 10px', flex: 1 }}
                />
                {suggestions.length > 0 && (
                    <ul style={{ position: 'absolute', backgroundColor: 'white', marginTop: '40px', listStyle: 'none', padding: '10px', border: '1px solid #ccc', zIndex: 999, width: '300px' }}>
                        {suggestions.map((item) => (
                            <li key={item.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/catalog?search=${encodeURIComponent(item.title)}`)}>
                                {item.title}
                            </li>
                        ))}
                    </ul>
                )}
            </form>

            <div style={{ display: 'flex', padding: '20px' }}>
                <form onSubmit={handleSubmit} style={{ width: '250px', marginRight: '30px' }}>
                    <h3>Фильтры</h3>
                    <label>Категория:</label><br />
                    <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))}>
                        {categoryOptions.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <br /><br />
                    <label>Максимальная цена: {priceMax} ₽</label><br />
                    <input
                        type="range"
                        min="1000"
                        max="200000"
                        step="1000"
                        value={priceMax}
                        onChange={e => setPriceMax(Number(e.target.value))}
                        style={{ width: '100%' }}
                    />

                    <br /><br />
                    {Object.entries(filters).map(([key, values]) => (
                        <div key={key} style={{ marginBottom: '10px' }}>
                            <strong>{key}:</strong><br />
                            {values.map(val => (
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
                    <button type="submit">Показать</button>
                </form>

                <div style={{ flex: 1 }}>
                    <h3>Результаты</h3>
                    {products.length === 0 ? (
                        <p>Нет товаров по фильтру.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                            {products.map(product => (
                                <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
                                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                        <h4>{product.title}</h4>
                                        <p>{product.price} ₽</p>
                                        <p><small>{product.brand}</small></p>
                                    </Link>
                                    <button onClick={() => toggleProduct(product.id)} style={{ marginTop: '10px', marginRight: '5px' }}>
                                        {compareIds.includes(product.id) ? 'Убрать из сравнения' : 'Сравнить'}
                                    </button>
                                    <button onClick={() => toggleFavorite(product.id)}>
                                        {favorites.includes(product.id) ? '💔 Удалить' : '💖 В избранное'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Catalog;
