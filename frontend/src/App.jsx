import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Catalog from './components/Catalog';
import ProductDetail from './components/ProductDetail';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
    return (
        <Router>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ textAlign: 'center' }}>НайдемВСЕ</h1>

                <Routes>
                    <Route path="/" element={<Catalog />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
