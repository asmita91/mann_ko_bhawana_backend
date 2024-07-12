const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers'); // Adjust the path as needed
const { authGuard } = require('../middleware/authGuard');

// User routes
router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/profile', userController.getProfile);
router.put('/profile', authGuard, userController.editProfile);
router.get('/all_users', userController.getUsers);
router.get('/:id', userController.getSingleUser);
router.put('/:id', userController.editUser);



// router.put("/update/password", userController.updatePassword);
router.post("/forgot-password", userController.forgotPassword);
router.put("/password/reset/:token", userController.resetPassword);

module.exports = router;
