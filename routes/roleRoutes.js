const express = require('express')
const router = express.Router()
const roleController = require('../controllers/roleController.js')

//Public Route
router.post('/addRole', roleController.addRole)
router.get('/getAllRoles', roleController.getAllRoles)

module.exports = router