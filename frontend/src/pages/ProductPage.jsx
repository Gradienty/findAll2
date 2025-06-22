// frontend/src/pages/ProductPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { FaArrowLeft, FaBalanceScale } from 'react-icons/fa';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { compareIds, toggleProduct } = useCompare();

    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get(`http://localhost:5000/api/products/${id}`);
            setProduct(res.data);
        };
        fetch();
    }, [id]);

    if (!product) return <div style={{ color: '#fff', textAlign: 'center' }}>Загрузка...</div>;

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
                color: '#fff',
                padding: '40px',
                fontFamily: 'Inter, sans-serif',
            }}
        >
            <Link
                to="/"
                style={{
                    color: '#a084e8',
                    textDecoration: 'none',
                    marginBottom: '30px',
                    display: 'inline-flex',
                    alignItems: 'center',
                }}
            >
                <FaArrowLeft style={{ marginRight: '8px' }} /> Назад в каталог
            </Link>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '40px',
                    marginBottom: '40px',
                }}
            >
                <img
                    src={product.image_url}
                    alt={product.title}
                    style={{
                        width: '300px',
                        height: 'auto',
                        borderRadius: '16px',
                        boxShadow: '0 0 20px rgba(160, 132, 232, 0.3)',
                    }}
                />
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{product.title}</h1>
                    <p style={{ fontStyle: 'italic', color: '#ccc', marginBottom: '10px' }}>{product.brand}</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#a084e8' }}>{product.price} ₽</p>
                    <p style={{ marginTop: '20px', lineHeight: '1.6' }}>{product.description}</p>

                    <button
                        onClick={() => toggleProduct(product.id)}
                        style={{
                            marginTop: '20px',
                            background: '#6a00f4',
                            padding: '12px 24px',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        {compareIds.includes(product.id) ? 'Убрать из сравнения' : <><FaBalanceScale style={{ marginRight: 6 }} /> Сравнить</>}
                    </button>

                    <div style={{ marginTop: '30px' }}>
                        <h3 style={{ marginBottom: '10px' }}>Характеристики:</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {product.characteristics &&
                                Object.entries(product.characteristics).map(([key, value]) => (
                                    <li key={key} style={{ marginBottom: '6px' }}>
                                        <strong>{key}</strong>: {value}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div>
                <h3>Цены в магазинах:</h3>
                {product.offers && product.offers.length > 0 ? (
                    <table
                        style={{
                            width: '100%',
                            marginTop: '15px',
                            borderCollapse: 'collapse',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor: '#1f1b2e',
                        }}
                    >
                        <thead>
                        <tr style={{ backgroundColor: '#6a00f4' }}>
                            <th style={{ padding: '12px', color: '#fff' }}>Магазин</th>
                            <th style={{ color: '#fff' }}>Цена</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {product.offers.map((offer, i) => (
                            <tr
                                key={i}
                                style={{
                                    backgroundColor: i % 2 === 0 ? '#2d2650' : '#1f1b2e',
                                }}
                            >
                                <td style={{ padding: '12px' }}>{offer.name}</td>
                                <td>{offer.store_price} ₽</td>
                                <td>
                                    <a
                                        href={offer.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#a084e8' }}
                                    >
                                        Перейти
                                    </a>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Нет предложений от магазинов</p>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
