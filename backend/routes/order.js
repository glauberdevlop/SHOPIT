const express = require('express');
const router = express.Router();

const { newOrder, getSingleOrder, myOrders } = require('../controllers/orderController');

const { isAuthenticateUser, authorizeRoles } = require('../middlewares/auth');

router.route('/order/new').post(isAuthenticateUser ,newOrder)

router.route('/order/:id').get(isAuthenticateUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticateUser, myOrders);

module.exports = router;