import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, content: '' });

    const user = getCurrentUser();

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            console.error('Ошибка при загрузке товара:', err);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
            setReviews(res.data);
        } catch (err) {
            console.error('Ошибка при загрузке отзывов:', err);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:5000/api/reviews',
                {
                    product_id: id,
                    rating: newReview.rating,
                    content: newReview.content
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setNewReview({ rating: 5, content: '' });
            fetchReviews();
        } catch (err) {
            console.error('Ошибка при добавлении отзыва:', err);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchReviews();
        } catch (err) {
            console.error('Ошибка при удалении отзыва:', err);
        }
    };

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    if (!product) return <div>Загрузка...</div>;

    return (
        <div style={{
            minHeight: '100vh',

            color: '#fff',
            padding: '40px'
        }}>
            <div style={{
                background: '#1c1b3a',
                padding: '30px',
                borderRadius: '20px',
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                <h2 style={{ color: '#a084e8' }}>{product.title}</h2>
                <p>{product.description}</p>
                <p><strong>Цена:</strong> {product.price} ₽</p>
                <img src={product.image_url} alt={product.title} style={{ maxWidth: '100%', borderRadius: '10px' }} />
                ...
            </div>
        </div>

    );
};

export default ProductDetail;
