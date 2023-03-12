const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController.js')


//Public Route
router.post('/register', userController.userRegistration)
router.post("/login", userController.userLogin);
router.post("/reset-password", userController.resetPassword);
router.post("/reset-password/:userId/:token", userController.resetPasswordFromLink);
//Private Route


module.exports = router