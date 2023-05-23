// /server/src/routes/api.js

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the Chatious API!');
});

module.exports = router;
