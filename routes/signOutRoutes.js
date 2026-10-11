const express = require('express');
const router = express.Router();
const signoutController = require('../controllers//signoutController');
const isAuthenticated = require('../middleware/authMiddleware');
router.get('/',isAuthenticated,signoutController.signOut);


module.exports = router;