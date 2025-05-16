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
        <div style={{ padding: '20px' }}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p><strong>Цена:</strong> {product.price} ₽</p>
            <p><strong>Магазин:</strong> {product.store_name}</p>
            <img src={product.image_url} alt={product.title} style={{ maxWidth: '300px' }} />

            <hr style={{ margin: '30px 0' }} />

            <h3>Отзывы</h3>
            {reviews.length === 0 ? (
                <p>Пока нет отзывов.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {reviews.map((review) => (
                        <li key={review.id} style={{ marginBottom: '15px' }}>
                            <strong>Оценка:</strong> {review.rating} / 5<br />
                            <strong>Пользователь:</strong> {review.user_email}<br />
                            <p>{review.content}</p>
                            {user && user.id === review.user_id && (
                                <button onClick={() => handleDeleteReview(review.id)} style={{ color: 'red' }}>
                                    Удалить
                                </button>
                            )}
                            <hr />
                        </li>
                    ))}
                </ul>
            )}

            {user ? (
                <>
                    <h4>Оставить отзыв</h4>
                    <form onSubmit={handleReviewSubmit}>
                        <label>
                            Оценка:{' '}
                            <select
                                value={newReview.rating}
                                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                            >
                                {[5, 4, 3, 2, 1].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </label>
                        <br />
                        <label>
                            Отзыв:
                            <br />
                            <textarea
                                value={newReview.content}
                                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                                rows={4}
                                cols={40}
                                required
                            />
                        </label>
                        <br />
                        <button type="submit" style={{ marginTop: '10px' }}>Отправить</button>
                    </form>
                </>
            ) : (
                <p><em>Войдите, чтобы оставить отзыв.</em></p>
            )}
        </div>
    );
};

export default ProductDetail;
