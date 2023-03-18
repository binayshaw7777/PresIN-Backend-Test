const fileUpload = require('express-fileupload')
const express = require('express')
const router = express.Router()
const cloudinaryController = require('../controllers/cloudinaryController.js')
const upload = require('../config/cloudinary.js')


router.post('/single', upload.single('image'), cloudinaryController.uploadSingleImage);


module.exports = router