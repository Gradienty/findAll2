import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useFavorites } from '../context/FavoriteContext';
import { FaHeart, FaBalanceScale } from 'react-icons/fa';

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
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(100000);
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const location = useLocation();
    const { compareIds, toggleProduct } = useCompare();
    const { favorites, toggleFavorite } = useFavorites();
    const navigate = useNavigate();

    const searchQuery = new URLSearchParams(location.search).get('search');

    useEffect(() => {
        if (compareIds.length === 2) navigate('/compare');
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
        setSelectedFilters((prev) => {
            const values = prev[key] || [];
            return {
                ...prev,
                [key]: values.includes(value) ? values.filter((v) => v !== value) : [...values, value],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/products/filter', {
                category_id: categoryId,
                price_min: priceMin,
                price_max: priceMax,
                characteristics: selectedFilters,
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
        <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', color: '#fff' }}>
            <form onSubmit={handleSearchSubmit} style={{ padding: '20px 30px', display: 'flex', gap: '10px', position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={search}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: 'none', flex: 1 }}
                />
                {suggestions.length > 0 && (
                    <ul style={{ position: 'absolute', backgroundColor: '#fff', marginTop: '48px', listStyle: 'none', padding: '10px', borderRadius: '10px', color: '#000', zIndex: 999, width: '300px' }}>
                        {suggestions.map((item) => (
                            <li key={item.id} style={{ cursor: 'pointer', padding: '5px 10px' }} onClick={() => navigate(`/catalog?search=${encodeURIComponent(item.title)}`)}>
                                {item.title}
                            </li>
                        ))}
                    </ul>
                )}
            </form>

            <div style={{ display: 'flex', padding: '20px 30px' }}>
                <form onSubmit={handleSubmit} style={{ width: '260px', marginRight: '40px', background: '#320a80', padding: '20px', borderRadius: '20px' }}>
                    <h3 style={{ marginTop: 0 }}>Фильтры</h3>

                    <label>Цена от:</label>
                    <input
                        type="number"
                        value={priceMin}
                        min="0"
                        max={priceMax}
                        step="1"
                        onChange={(e) => setPriceMin(Number(e.target.value))}
                        style={{ width: '100%', padding: '6px', marginBottom: '10px', borderRadius: '6px' }}
                    />

                    <label>Цена до:</label>
                    <input
                        type="number"
                        value={priceMax}
                        min={priceMin}
                        max="1000000"
                        step="1"
                        onChange={(e) => setPriceMax(Number(e.target.value))}
                        style={{ width: '100%', padding: '6px', marginBottom: '15px', borderRadius: '6px' }}
                    />

                    <label>Категория:</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} style={{ width: '100%', padding: '6px', borderRadius: '6px', marginBottom: '15px' }}>
                        {categoryOptions.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

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

                    <button type="submit" style={{ marginTop: '10px', width: '100%' }}>Показать</button>
                </form>

                <div style={{ flex: 1 }}>
                    <h3>Результаты</h3>
                    {products.length === 0 ? (
                        <p>Нет товаров по фильтру.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                            {products.map((product) => (
                                <div key={product.id} style={{ background: '#240058', borderRadius: '14px', padding: '15px', color: '#fff' }}>
                                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px' }} />
                                        <h4 style={{ margin: '10px 0 5px' }}>{product.title}</h4>
                                        <p>{product.price} ₽</p>
                                        <p><small>{product.brand}</small></p>
                                    </Link>
                                    <button onClick={() => toggleProduct(product.id)} style={{ marginTop: '10px', marginRight: '10px' }}>
                                        {compareIds.includes(product.id) ? 'Убрать из сравнения' : 'Сравнить'}
                                    </button>
                                    <button onClick={() => toggleFavorite(product.id)} style={{ backgroundColor: '#ff4081' }}>
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
