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
});

// Get logged in user orders  => /api/v1/order/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({user: req.user.id})

    res.status(200).json({
        success:true,
        orders
    })
});

// Get All orders - ADIMN  => /api/v1/admin/order
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalAmount
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
});

// Upadate / Process order - ADIMN  => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === 'Delivered'){
        return next(new ErroHandle('Yuo have already delivered this order', 400))
    }

    order.orderItems.forEach(async item =>{
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status,
    order.delieveAt = Date.now()

    await order.save()

    res.status(200).json({
        success:true
    })
});

async function updateStock(id, quantity){
    const product = Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({validateBeforeSave: false})
}

// Delete Order  => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order){
        return next(new ErroHandle('No order found with this ID', 404))
    }

    await order.remove()

    res.status(200).json({
        success:true
    })
});