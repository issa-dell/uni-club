const express = require('express');
const router = express.Router();
const uniClubController = require('../controllers/uniClubController');
const isAuthenticated = require('../middleware/authMiddleware');
router.get('/',isAuthenticated, uniClubController.getUniClubHome);
module.exports = router;