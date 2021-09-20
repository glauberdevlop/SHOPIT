const User = require('../models/user');

const ErrorHandle = require('../utils/errorHandle');
const catchAsycnErrors = require('../middlewares/catchAsycnErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');
const cloudinary = require('cloudinary')

//Register a user => /api/v1/register
exports.registerUser = catchAsycnErrors( async (req, res, next) => {

    const result = cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale',
    })

    const {name, email, password} = req.body;

    const user = await User.create({
        name, 
        email,
        password,
        avatar:{
            public_id: (await result).public_id,
            url: (await result).secure_url
        }
    });

    sendToken(user, 200, res);

});

//Login User => /a[i/v1/login
exports.loginUser = catchAsycnErrors(async (req, res, next) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandle('Please enter email & password', 400))
    }

    //Finding user in database
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandle('Invalid Email or Password', 401))
    }

    // Checks if password is correct not
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandle('Invalid Email or Password', 401))
    }

    sendToken(user, 200, res);

});

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsycnErrors(async (req, res, next) => {

    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandle('User not found with this email', 401))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false})

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Yuor password reset token is as follow:\n\n${resetUrl}\n\nIf yuo have not
    requested this email, then ignore it`

    try {

        await sendEmail({
            email: user.email,
            subject: 'shopIt Password Recovery',
            message
        })

        res.status(200).json({
            success:true,
            message: `Email sent to: ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandle(error.message, 500))
    }
})

// Forgot Password => api/v1/password/reset/:token 
exports.resetPassword = catchAsycnErrors(async (req, res, next) => {

    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user){
        return next(new ErrorHandle('Password reset token is invalid or has been expired', 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandle('Passowrd does not match', 400))
    }

    // Setup new Password 
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()

    sendToken(user, 200, res)
})

// Get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsycnErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
})

// Update / Change password => /api/v1/password/update
exports.updatePassword = catchAsycnErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);

    if (!isMatched){
        return next(new ErrorHandle('Old password is incorrect'))
    }

    user.password = req.body.password;
    await user.save()

    sendToken(user, 200, res)
})

// Update user profile => /api/v1/me/update
exports.updateProfile = catchAsycnErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // Update avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true,
    })
});


// Logout user => /api/v1/logout
exports.logout = catchAsycnErrors(async (req, res, next) =>{
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        sucess:true,
        message:"Logged out"
    })
})

// Adimin Routes

// Get all users => /api/v1/admin/users
exports.allUsers = catchAsycnErrors(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
});


// Get users details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsycnErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user){
        return next(new ErrorHandle(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })
});

// Update user profile => /api/v1/admin/user/id
exports.updateUser = catchAsycnErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true,
    })
});

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsycnErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user){
        return next(new ErrorHandle(`User does not found with id: ${req.params.id}`))
    }

    //Remove avatar from cloudinary - TODO
    

    await user.remove();

    res.status(200).json({
        success:true,
    })
});
