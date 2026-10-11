const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const isAuthenticated = require('../middleware/authMiddleware');


router.get('/',isAuthenticated,chatController.messageComing)


module.exports = router;