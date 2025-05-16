const pool = require('../config/db');

// Получить все товары
async function getAllProducts() {
    const res = await pool.query(`
        SELECT p.*, c.name AS category_name, s.name AS store_name
        FROM products p
                 LEFT JOIN categories c ON p.category_id = c.id
                 LEFT JOIN stores s ON p.store_id = s.id
        ORDER BY p.created_at DESC
    `);
    return res.rows;
}

// Получить товар по ID
async function getProductById(id) {
    const res = await pool.query(`
        SELECT p.*, c.name AS category_name, s.name AS store_name
        FROM products p
                 LEFT JOIN categories c ON p.category_id = c.id
                 LEFT JOIN stores s ON p.store_id = s.id
        WHERE p.id = $1
    `, [id]);
    return res.rows[0];
}

// Добавить товар
async function createProduct({
                                 title,
                                 description,
                                 price,
                                 brand,
                                 image_url,
                                 availability,
                                 characteristics,
                                 category_id,
                                 store_id
                             }) {
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
    let query = `
        SELECT p.*, c.name AS category_name, s.name AS store_name
        FROM products p
                 LEFT JOIN categories c ON p.category_id = c.id
                 LEFT JOIN stores s ON p.store_id = s.id
        WHERE 1=1
    `;
    const values = [];
    let index = 1;

    // Фильтр по категории
    if (category_id) {
        query += ` AND p.category_id = $${index++}`;
        values.push(category_id);
    }

    // Фильтр по цене
    if (price_max) {
        query += ` AND p.price <= $${index++}`;
        values.push(price_max);
    }

    // Фильтр по бренду
    if (brand) {
        query += ` AND p.brand ILIKE $${index++}`;
        values.push(`%${brand}%`);
    }

    // Фильтр по характеристикам (включая массивы значений)
    if (characteristics && typeof characteristics === 'object') {
        for (const [key, value] of Object.entries(characteristics)) {
            if (Array.isArray(value)) {
                if (value.length === 0) continue;

                const clauses = [];
                for (const v of value) {
                    clauses.push(`p.characteristics ->> $${index++} ILIKE $${index++}`);
                    values.push(key, `%${v}%`);
                }
                query += ` AND (${clauses.join(' OR ')})`;
            } else {
                query += ` AND p.characteristics ->> $${index++} ILIKE $${index++}`;
                values.push(key, `%${value}%`);
            }
        }
    }

    // Отладка — покажи SQL и параметры
    console.log('SQL:', query);
    console.log('VALUES:', values);

    const res = await pool.query(query, values);
    return res.rows;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    filterProducts
};
