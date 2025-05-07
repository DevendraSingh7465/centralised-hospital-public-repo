// Packages
const express = require("express");
const router = express.Router();

// Controller
const { bookAppointment } = require("../Controller/user_controller");
const { fetchAppointments } = require("../Controller/user_controller");
const { updateAppointmentStatus } = require("../Controller/user_controller");
const { fetchSingleUser } = require("../Controller/user_controller");
const { FetchHospitalAndDoctorDetails } = require("../Controller/user_controller");

// Routes for requests
router.post("/book", bookAppointment);
router.get("/appointments", fetchAppointments);
router.post("/updateAppointmentStatus/:id", updateAppointmentStatus);
router.get("/fetchSingleUser", fetchSingleUser);
router.get("/FetchHospitalAndDoctorDetails/:id", FetchHospitalAndDoctorDetails);


module.exports = router;