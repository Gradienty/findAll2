import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CompareProvider } from './context/CompareContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CompareProvider>
            <App />
        </CompareProvider>
    </React.StrictMode>
);
