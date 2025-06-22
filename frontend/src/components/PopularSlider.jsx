import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PopularSlider = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products/analytics/views');
                setProducts(res.data.slice(0, 10)); // топ-10
            } catch (err) {
                console.error('Ошибка при загрузке популярных товаров:', err);
            }
        };

        fetchPopular();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        arrows: false
    };

    return (
        <div style={{
            padding: '20px 40px',
            background: '#1c1533',
            borderRadius: '16px',
            marginBottom: '40px',
            boxShadow: '0 0 15px rgba(160, 132, 232, 0.3)'
        }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>🔥 Популярные товары</h2>
            <Slider {...settings}>
                {products.map(product => (
                    <div key={product.id} style={{ padding: '0 10px' }}>
                        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: '#fff' }}>
                            <div style={{
                                background: '#2a1d4d',
                                borderRadius: '12px',
                                padding: '15px',
                                textAlign: 'center',
                                height: '100%'
                            }}>
                                <img src={product.image_url} alt={product.title} style={{ height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                                <h4 style={{ fontSize: '1rem', margin: '0 0 5px' }}>{product.title}</h4>
                                <p style={{ color: '#a084e8' }}>{product.price} ₽</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default PopularSlider;
