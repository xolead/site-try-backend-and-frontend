const Router = require('express');
const router = new Router();
const productController = require('../controllers/product.controller.js');

router.post('/api/product', productController.createProduct);

router.get('/api/product', productController.getProducts);

router.get('/api/product/:id', productController.getProduct);

router.put('/api/product', productController.updateProduct);

router.delete('/api/product/:id', productController.deleteProduct);

module.exports = router;
