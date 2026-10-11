const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');
const showAccController = require('../controllers/showAccController');

router.get('/:username',isAuthenticated, showAccController.getAllInfo);

module.exports = router;