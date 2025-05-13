const pool = require('../config/db');

const getAllProducts = async () => {
    const res = await pool.query('SELECT * FROM products');
    const products = res.rows;

    for (let product of products) {
        // Характеристики
        const specsRes = await pool.query(
            'SELECT key, value FROM specifications WHERE product_id = $1',
            [product.id]
        );
        product.specs = Object.fromEntries(specsRes.rows.map(s => [s.key, s.value]));

        // Магазины
        const storesRes = await pool.query(
            'SELECT name, url, store_price FROM stores WHERE product_id = $1',
            [product.id]
        );
        product.stores = storesRes.rows;
    }

    return products;
};

module.exports = { getAllProducts };