const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function findUserByEmail(email) {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
}

async function createUser(email, password) {
    const hash = await bcrypt.hash(password, 10);
    const res = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
        [email, hash]
    );
    return res.rows[0];
}

async function validatePassword(email, password) {
    const user = await findUserByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password_hash);
    return isMatch ? user : null;
}

module.exports = {
    findUserByEmail,
    createUser,
    validatePassword,
};
