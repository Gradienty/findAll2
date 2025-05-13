const pool = require('../config/db');

const getReviewsByProductId = async (productId) => {
    const res = await pool.query('SELECT * FROM reviews WHERE product_id = $1', [productId]);
    return res.rows;
};

module.exports = { getReviewsByProductId };