const express = require('express');
const { createUser, checkAuth } = require('../controllers/authController');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', checkAuth);

module.exports = router;
