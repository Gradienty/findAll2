import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';

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
    const [brand, setBrand] = useState('');
    const { compareIds, toggleProduct } = useCompare();
    const navigate = useNavigate();

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
                brand,
                characteristics: selectedFilters
            });
            setProducts(res.data);
        } catch (err) {
            console.error('Ошибка при фильтрации:', err);
        }
    };

    useEffect(() => {
        const loadAllProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error('Ошибка при загрузке товаров:', err);
            }
        };
        loadAllProducts();
    }, []);

    return (
        <div style={{ display: 'flex', padding: '20px' }}>
            {/* Боковая панель */}
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
                <label>Бренд:</label><br />
                <input
                    type="text"
                    placeholder="Samsung"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
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

            {/* Каталог */}
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
                                <button onClick={() => toggleProduct(product.id)} style={{ marginTop: '10px' }}>
                                    {compareIds.includes(product.id) ? 'Убрать из сравнения' : 'Сравнить'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;
