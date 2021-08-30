const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser
} = require('../controllers/authController');

const { isAuthenticateUser, authorizeRoles } = require('../middlewares/auth')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticateUser, getUserProfile, authorizeRoles('admin'));
router.route('/password/update').put(isAuthenticateUser, updatePassword);
router.route('/me/update').put(isAuthenticateUser, updateProfile);

router.route('/admin/users').get(isAuthenticateUser, authorizeRoles('admin'), allUsers)
router.route('/admin/user/:id')
    .get(isAuthenticateUser, authorizeRoles('admin'), getUserDetails)
    .put(isAuthenticateUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticateUser, authorizeRoles('admin'), deleteUser)

module.exports = router;