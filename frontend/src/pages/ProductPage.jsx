import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCompare } from '../context/CompareContext';
import './ProductPage.css';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [offers, setOffers] = useState([]);
    const { compareIds, toggleProduct } = useCompare();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error('Ошибка загрузки товара:', err);
            }
        };

        const fetchOffers = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/stores/by-product/${id}`);
                setOffers(res.data);
            } catch (err) {
                console.error('Ошибка загрузки предложений магазинов:', err);
            }
        };

        fetchProduct();
        fetchOffers();
    }, [id]);

    if (!product) return <div className="product-page">Загрузка...</div>;

    return (
        <div className="product-page">
            <Link to="/" className="back-link">← Назад в каталог</Link>

            <div className="product-main">
                <img src={product.image_url} alt={product.title} className="product-image" />

                <div className="product-info">
                    <h1>{product.title}</h1>
                    <p className="product-brand">{product.brand}</p>
                    <p className="product-price">{product.price} ₽</p>
                    <p className="product-description">{product.description}</p>

                    <button onClick={() => toggleProduct(product.id)}>
                        {compareIds.includes(product.id) ? 'Убрать из сравнения' : 'Сравнить'}
                    </button>

                    <h3>Характеристики:</h3>
                    <ul className="product-characteristics">
                        {product.characteristics &&
                            Object.entries(product.characteristics).map(([key, value]) => (
                                <li key={key}>
                                    <strong>{key}</strong>: {value}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>

            <div className="product-offers">
                <h3>Цены в магазинах:</h3>
                {offers.length === 0 ? (
                    <p>Нет предложений.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Магазин</th>
                            <th>Цена</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {offers.map((offer, index) => (
                            <tr key={index}>
                                <td>{offer.name}</td>
                                <td>{offer.store_price} ₽</td>
                                <td>
                                    <a href={offer.url} target="_blank" rel="noopener noreferrer">Перейти</a>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
