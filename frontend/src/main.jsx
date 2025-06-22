import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FavoriteProvider } from './context/FavoriteContext.jsx';
import { CompareProvider } from './context/CompareContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CompareProvider>
            <FavoriteProvider>
                <App />
            </FavoriteProvider>
        </CompareProvider>
    </React.StrictMode>
);
