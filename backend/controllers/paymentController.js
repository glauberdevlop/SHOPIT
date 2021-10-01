const catchAsyncError = require('../middlewares/catchAsycnErrors');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Process stripe payments => /api/v1/payment/process
exports.processPayment = catchAsyncError( async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntent.create({
        amount: req.body.amount,
        currency: 'usd',

        metadata: { intergration_check: 'accept_a_payment' }
    });

    res.status(200).json({
        success:true,
        client_secret: paymentIntent.client_secret
    })
})

// Send stripe API Key  => /api/v1/strypeapi
exports.sendStripeApi = catchAsyncError( async (req, res, next) => {

    res.status(200).json({
       stripeApiKey: process.env.STRIPE_API_KEY
    })
})