const express = require('express');
const router = express.Router();
const products = require('../controllers/products');
const catchAsync = require('../utils/catchAsync');
const { productSchema } = require('../schemas.js');
const {LogInPage, isLoggedIn, isAuthor, validateProduct } = require('../middleware');

const Product = require('../models/product');

router.route('/')
    .get(LogInPage, catchAsync(products.index))
    .post( validateProduct, catchAsync(products.createProduct));

router.get('/new', isLoggedIn, products.renderNewForm);

router.route('/:id')
    .get(LogInPage, catchAsync(products.showProduct))
    .put(isAuthor, validateProduct, catchAsync(products.updateProduct))
    .delete(isAuthor, catchAsync(products.deleteProduct));

router.get('/:id/edit', isAuthor, catchAsync(products.renderEditForm));


module.exports = router;
