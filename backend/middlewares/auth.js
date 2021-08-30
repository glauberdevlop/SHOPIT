const User = require("../models/user")
const ErrorHandle = require("../utils/errorHandle");
const catchAsycnErrors = require("./catchAsycnErrors");

const jwt = require('jsonwebtoken')

// Checks if user is authenticated or not
exports.isAuthenticateUser = catchAsycnErrors(async (req, res, next) => {

    const {token } = req.cookies;

    if(!token){
        return next(new ErrorHandle('Login first to access this resource', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next()
});

// Handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(
            new ErrorHandle(`Role (${req.user.role}) is not allowed success this resource`,
            403))
        }
        next()
    }
}