const Attendance = require("../models/Attendance.js");

const STATUS_SUCCESS = "success";
const STATUS_FAILED = "failed";
const SORT_BY = "sortBy";
const SORT_ORDER_DESC = "desc";


class attendanceController {

    static allAttendees = async (req, res) => {
        try {
            const filter = {};
            const sort = {};

            // Extract query parameters and add to filter object
            const queryParams = Object.keys(req.query);
            queryParams.forEach((param) => {
                if (param === SORT_BY) {
                    const sortOrder = req.query.sortOrder === SORT_ORDER_DESC ? -1 : 1;
                    sort[req.query.sortBy] = sortOrder;
                } else {
                    filter[param] = req.query[param];
                }
            });

            const listOfAllAttendees = await Attendance.find(filter).sort(sort);
            if (!listOfAllAttendees || listOfAllAttendees.length == 0) return res.send({status: STATUS_FAILED, message: "No attendees found!"});
            
            res.status(200).send({ status_code: 200, status: STATUS_SUCCESS, message: "All attendees fetched successfully!", attendanceList: listOfAllAttendees});
        } catch (error) {
            console.log(error);
            res.status(400).send({ status_code: 400, status: STATUS_FAILED, message: `Something went wrong! ${error}`});
        }
    }

    static createAttendance = async (req, res) => {
        try {
            const {userID, markedMinute, markedHour, markedDate, markedMonth, markedYear, organization, location} = req.body;

            if (!userID || !markedMinute || !markedHour || !markedDate || !markedMonth || !markedYear || !organization || !location) {
                return res.send({status: STATUS_FAILED, message: "All fields are required!"});
            }

            // Check if attendance already exists for the same date-month-year or not? else create new and update
            const existingAttendance = await Attendance.findOneAndUpdate(
                { userID: userID, markedDate: markedDate, markedMonth: markedMonth, markedYear: markedYear },
                { userID, markedMinute, markedHour, markedDate, markedMonth, markedYear, organization, location },
                { upsert: true, new: true }
              );
            
              if (existingAttendance) {
                return res.status(400).send({ status_code: 400, status: STATUS_FAILED, message: 'Attendance already marked for this date!' });
              }
            
              res.status(200).send({ status_code: 200, status: STATUS_SUCCESS, message: 'Attendance marked successfully!' });
        } catch (error) {
            console.log(error);
            res.status(400).send({ status_code: 400, status: STATUS_FAILED, message: `Something went wrong! ${error}`});
        }
    }


    static getAttendanceById = async (req, res) => {
        try {
            const attendanceIsPresent = await Attendance.findById(req.params.id);
            if (!attendanceIsPresent) {
                return res.status(404).send({status: STATUS_FAILED, message: "Attendance not found!"});
            }
            res.status(200).send({ status_code: 200, status: STATUS_SUCCESS, message: "Attendance fetched successfully!", data: attendanceIsPresent});

        } catch (error) {
            console.error(error);
            if (error.name === 'CastError') {
              return res.status(400).send({ status_code: 400, status: STATUS_FAILED, message: `Invalid ${error.path}: ${error.value}` });
            }
            res.status(500).send({ status_code: 500, status: STATUS_FAILED, message: "Something went wrong!" });
          }
    }

}

module.exports = attendanceController