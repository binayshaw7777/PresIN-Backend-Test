const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController.js')


//Public Route
router.post('/register', userController.userRegistration)
router.post("/login", userController.userLogin);


//Private Route

module.exports = router