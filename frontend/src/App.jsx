import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComparePage from './pages/ComparePage';
import Catalog from './components/Catalog';
import ProductDetail from './components/ProductDetail';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProductPage from "./pages/ProductPage.jsx";
import FavoritesPage from './pages/FavoritesPage';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';


function App() {
    return (
        <Router>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ textAlign: 'center' }}>НайдемВСЕ</h1>
                <Navbar />
                <Routes>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/" element={<Catalog />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
