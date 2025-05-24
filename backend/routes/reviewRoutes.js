const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Отзывы');
});

module.exports = router;
