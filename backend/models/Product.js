const pool = require('../config/db');

// Получить все товары
async function getAllProducts() {
    const res = await pool.query(`SELECT * FROM products`);
    return res.rows;
}

// Получить товар по ID
async function getProductById(id) {
    const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return res.rows[0];
}

// Добавить товар
async function createProduct(data) {
    const {
        title,
        description,
        price,
        brand,
        image_url,
        availability,
        characteristics,
        category_id,
        store_id
    } = data;

    const res = await pool.query(
        `INSERT INTO products
    (title, description, price, brand, image_url, availability, characteristics, category_id, store_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
        [
            title,
            description,
            price,
            brand,
            image_url,
            availability,
            characteristics,
            category_id,
            store_id
        ]
    );
    return res.rows[0];
}

// Обновить товар
async function updateProduct(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const res = await pool.query(
        `UPDATE products SET ${updates} WHERE id = $${keys.length + 1} RETURNING *`,
        [...values, id]
    );
    return res.rows[0];
}

// Удалить товар
async function deleteProduct(id) {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
}

// Фильтрация товаров
async function filterProducts(filters) {
    const { category_id, price_max, brand, characteristics } = filters;

    let query = `SELECT * FROM products WHERE 1=1`;
    const values = [];
    let i = 1;

    if (category_id) {
        query += ` AND category_id = $${i++}`;
        values.push(category_id);
    }

    if (price_max && price_max > 0) {
        query += ` AND price <= $${i++}`;
        values.push(price_max);
    }

    if (brand && brand.trim() !== '') {
        query += ` AND brand ILIKE $${i++}`;
        values.push(`%${brand}%`);
    }

    if (characteristics && typeof characteristics === 'object') {
        for (const [key, val] of Object.entries(characteristics)) {
            if (Array.isArray(val) && val.length > 0) {
                const orClauses = [];
                for (const v of val) {
                    if (typeof v === 'string' && v.trim() !== '') {
                        orClauses.push(`characteristics ->> $${i++} ILIKE $${i++}`);
                        values.push(key, `%${v}%`);
                    }
                }
                if (orClauses.length > 0) {
                    query += ` AND (${orClauses.join(' OR ')})`;
                }
            } else if (typeof val === 'string' && val.trim() !== '') {
                query += ` AND characteristics ->> $${i++} ILIKE $${i++}`;
                values.push(key, `%${val}%`);
            }
        }
    }

    console.log('\n🔍 SQL FILTER QUERY:');
    console.log(query);
    console.log('🔢 VALUES:', values);

    const result = await pool.query(query, values);
    return result.rows;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    filterProducts
};
