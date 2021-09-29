const express = require('express');
const router = express.Router();

const { 
        processPayment,
        sendStripeApi
    } = require('../controllers/paymentController');

const { isAuthenticateUser } = require('../middlewares/auth');

router.route('/payment/process').post(isAuthenticateUser , processPayment)
router.route('/stripeapi').get(isAuthenticateUser , sendStripeApi)

module.exports = router;