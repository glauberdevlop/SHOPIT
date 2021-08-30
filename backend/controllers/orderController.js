const Order = require('../models/order');
const Product = require('../models/product');

const ErroHandle = require('../utils/errorHandle');
const catchAsyncErrors = require('../middlewares/catchAsycnErrors');
const ErrorHandle = require('../utils/errorHandle');

// Create new order => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user._id
    });

    res.status(200).json({
        success:true,
        order
    })
});

// Get single order  => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order){
        return next(new ErroHandle('No order found with this ID', 404))
    }

    res.status(200).json({
        success:true,
        order
    })
})

// Get logged in user orders  => /api/v1/order/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({user: req.user.id})

    res.status(200).json({
        success:true,
        orders
    })
})