const express = require('express');
const router = express.Router();
const jsonParser = express.json();

const { register, login } = require('../../controllers/users');

router.post('/register', jsonParser, register);
router.post('/login', jsonParser, login);

module.exports = router;
