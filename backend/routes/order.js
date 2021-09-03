const express = require('express');
const router = express.Router();

const { 
        newOrder, 
        getSingleOrder, 
        myOrders, 
        allOrders, 
        updateOrder, 
        deleteOrder 
    } = require('../controllers/orderController');

const { isAuthenticateUser, authorizeRoles } = require('../middlewares/auth');

router.route('/order/new').post(isAuthenticateUser ,newOrder)

router.route('/order/:id').get(isAuthenticateUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticateUser, myOrders);

router.route('/admin/orders/').get(isAuthenticateUser, authorizeRoles('admin') ,allOrders);
router.route('/admin/order/:id')
    .put(isAuthenticateUser, authorizeRoles('admin') ,updateOrder)
    .delete(isAuthenticateUser, authorizeRoles('admin') ,deleteOrder)

module.exports = router;