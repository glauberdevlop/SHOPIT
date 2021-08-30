const express = require('express');
const router = express.Router();

const { 
    getProducts,
    newProduct,
    getSingleProduct,
    UpdateProduct,
    deleteProduct 
} = require('../controllers/productControllers');

const {isAuthenticateUser, authorizeRoles } = require('../middlewares/auth')

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);

router.route('/admin/product/new').post(isAuthenticateUser, authorizeRoles('admin'), newProduct);

router.route('/admin/product/:id')
    .put(isAuthenticateUser, authorizeRoles('admin'), UpdateProduct)
    .delete(isAuthenticateUser, authorizeRoles('admin'), deleteProduct);

module.exports = router;