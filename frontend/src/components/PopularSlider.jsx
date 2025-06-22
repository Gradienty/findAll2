import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PopularSlider = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products/analytics/views');
                setProducts(res.data.slice(0, 10));
            } catch (err) {
                console.error('Ошибка при загрузке популярных товаров:', err);
            }
        };
        fetchPopular();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    return (
        <div style={{
            background: 'rgba(28, 21, 51, 0.9)',
            padding: '30px',
            borderRadius: '20px',
            margin: '0 auto 40px',
            maxWidth: '1200px',
            boxShadow: '0 0 30px rgba(160, 132, 232, 0.15)',
            backdropFilter: 'blur(8px)'
        }}>
            <h2 style={{
                color: '#a084e8',
                fontSize: '1.8rem',
                marginBottom: '20px',
                textAlign: 'center'
            }}>
                🔥 Популярные товары
            </h2>

            <Slider {...settings}>
                {products.map((product) => (
                    <div key={product.id} style={{ padding: '0 10px' }}>
                        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{
                                background: '#2a1d4d',
                                borderRadius: '16px',
                                padding: '16px',
                                textAlign: 'center',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                height: '100%'
                            }}
                                 onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                                 onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                    style={{
                                        width: '100%',
                                        height: '150px',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        marginBottom: '12px'
                                    }}
                                />
                                <h4 style={{ fontSize: '1rem', margin: '0 0 6px' }}>{product.title}</h4>
                                <p style={{ color: '#a084e8', fontWeight: 'bold' }}>{product.price} ₽</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default PopularSlider;
