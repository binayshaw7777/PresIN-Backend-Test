const express = require('express')
const fileUpload = require('express-fileupload')
const router = express.Router()
const cloudinaryController = require('../controllers/cloudinaryController.js')


//Public Routes
router.use(fileUpload({ useTempFiles: true, limits: { fileSize: 50 * 1024 * 1024 } }))
router.post('/singleimage', cloudinaryController.uploadSingleImage)


module.exports = router