import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComparePage from './pages/ComparePage';
import Catalog from './components/Catalog';
import ProductDetail from './components/ProductDetail';
import Login from './components/Auth/Login';
import ProductPage from "./pages/ProductPage.jsx";
import FavoritesPage from './pages/FavoritesPage';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
    return (
        <Router>
            <div style={{ minHeight: '100vh', background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)', paddingBottom: '30px' }}>
                <Navbar />
                <Routes>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/" element={<Catalog />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                </Routes>
            </div>
        </Router>
    );
}



export default App;
