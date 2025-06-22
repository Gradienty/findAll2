import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { FaTrashAlt } from 'react-icons/fa';

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

    if (!product) return <div style={{ color: '#fff', textAlign: 'center' }}>Загрузка...</div>;

    return (
        <div style={{
            minHeight: '100vh',
            padding: '40px',
            color: '#fff',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                background: '#1c1b3a',
                padding: '30px',
                borderRadius: '20px',
                maxWidth: '900px',
                margin: '0 auto',
                boxShadow: '0 0 20px rgba(160, 132, 232, 0.2)'
            }}>
                <h2 style={{ color: '#a084e8', marginBottom: '10px' }}>{product.title}</h2>
                <p style={{ marginBottom: '10px' }}>{product.description}</p>
                <p><strong>Цена:</strong> {product.price} ₽</p>
                <img src={product.image_url} alt={product.title} style={{ maxWidth: '100%', borderRadius: '12px', margin: '20px 0' }} />

                <hr style={{ borderColor: '#444', margin: '30px 0' }} />

                <h3 style={{ marginBottom: '15px', color: '#a084e8' }}>Отзывы:</h3>

                {reviews.length === 0 ? (
                    <p>Пока нет отзывов.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {reviews.map((review) => (
                            <li key={review.id} style={{
                                background: '#2a2150',
                                padding: '15px',
                                borderRadius: '10px',
                                marginBottom: '15px'
                            }}>
                                <p><strong>Оценка:</strong> {review.rating} / 5</p>
                                <p><strong>Пользователь:</strong> {review.user_email}</p>
                                <p>{review.content}</p>
                                {user && user.id === review.user_id && (
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        style={{
                                            background: '#ff4081',
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            marginTop: '10px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <FaTrashAlt /> Удалить
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {user ? (
                    <>
                        <h4 style={{ marginTop: '30px', color: '#a084e8' }}>Оставить отзыв</h4>
                        <form onSubmit={handleReviewSubmit}>
                            <label>
                                Оценка:
                                <select
                                    value={newReview.rating}
                                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                    style={{
                                        marginLeft: '10px',
                                        padding: '6px',
                                        borderRadius: '6px',
                                        background: '#2c254a',
                                        color: '#fff',
                                        border: 'none'
                                    }}
                                >
                                    {[5, 4, 3, 2, 1].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </label>

                            <br /><br />
                            <textarea
                                value={newReview.content}
                                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                                rows={4}
                                cols={50}
                                placeholder="Напишите свой отзыв..."
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: '#2c254a',
                                    color: '#fff',
                                    fontSize: '1rem'
                                }}
                            />

                            <br />
                            <button type="submit" style={{ marginTop: '10px' }}>
                                Отправить отзыв
                            </button>
                        </form>
                    </>
                ) : (
                    <p><em>Войдите, чтобы оставить отзыв.</em></p>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
