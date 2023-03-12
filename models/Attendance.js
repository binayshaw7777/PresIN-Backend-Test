const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const attendanceSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  markedTime: {
    //This will be in 24 hour format
    type: Number,
    required: true
  },
  markedDate: {
    type: Number,
    required: true
  },
  markedMonth: {
    type: Number,
    required: true
  },
  markedYear: {
    type: Number,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
});


// const joiAttendanceSchema = Joi.object({
//   userID: Joi.string().required(),
//   markedTime: Joi.number().required(),
//   markedDate: Joi.number().required(),
//   markedMonth: Joi.number().required(),
//   markedYear: Joi.number().required(),
//   organization: Joi.string().required(),
//   location: Joi.string().required(),
// });

// // Define a validate function to validate attendance data using Joi schema
// function validateAttendance(attendance) {
//   return joiAttendanceSchema.validate(attendance);
// }

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;

// module.exports = {
//   Attendance,
//   validateAttendance
// };