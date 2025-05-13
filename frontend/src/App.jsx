import React, { useState } from 'react';
import Header from './components/Header';
import Catalog from './components/Catalog';
import Compare from './components/Compare';

export default function App() {
    const [activeTab, setActiveTab] = useState("catalog");
    const [selectedProduct, setSelectedProduct] = useState(null);

    return (
        <div>
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />

            <main style={{ padding: '2rem' }}>
                {activeTab === "catalog" && (
                    <Catalog
                        onProductClick={(tab, product) => {
                            setActiveTab(tab);
                            if (product) setSelectedProduct(product);
                        }}
                    />
                )}

                {activeTab === "product-detail" && selectedProduct && (
                    <ProductDetail product={selectedProduct} onBack={() => {
                        setActiveTab("catalog");
                        setSelectedProduct(null);
                    }} />
                )}

                {activeTab === "compare" && <Compare />}
            </main>
        </div>
    );
}