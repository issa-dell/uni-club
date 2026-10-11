const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const upload = require('../middleware/upload');
const isAuthenticated = require('../middleware/authMiddleware');




router.get('/new',isAuthenticated, materialController.renderNewmaterialForm);

router.post('/',isAuthenticated, upload.single('materialFile'), materialController.creatematerial);

router.get('/',isAuthenticated, materialController.getAllmaterials);

router.post('/delete/:id', isAuthenticated,materialController.deletematerial);

router.get('/list',isAuthenticated, materialController.showAllMaterials);
module.exports = router;