// /server/src/routes/api.js

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the Chatious API!');
});
router.use('/users',require('./api/Users'));
router.use('/rooms',require('./api/rooms'));

module.exports = router;
