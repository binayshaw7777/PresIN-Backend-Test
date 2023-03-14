const express = require('express')
const router = express.Router()
const attendanceController = require('../controllers/attendanceController.js')


//Main Route
router.get("/all", attendanceController.allAttendees)
router.get("/:id", attendanceController.getAttendanceById)
router.post("/add-attendance", attendanceController.createAttendance)


module.exports = router