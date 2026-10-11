const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const isAuthenticated = require('../middleware/authMiddleware');

router.get('/',isAuthenticated,coursesController.getAllCourses)




module.exports = router;