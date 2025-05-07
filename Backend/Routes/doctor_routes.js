// Packages
const express = require("express");
const router = express.Router();

// Controller
const { DoctorSignin } = require("../Controller/doctor_controller");
const { FetchAllDoctors } = require("../Controller/doctor_controller");
const { FetchSingleDoctor } = require("../Controller/doctor_controller");
const { UpdateDoctor } = require("../Controller/doctor_controller");
const { DeleteDoctor } = require("../Controller/doctor_controller");
const { FetchMyAppointments } = require("../Controller/doctor_controller");
const { FetchHospitalAndDoctorDetails } = require("../Controller/doctor_controller");
const { UpdateDoctorEducation } = require("../Controller/doctor_controller");
const { UpdateDoctorExperience } = require("../Controller/doctor_controller");
const { UpdateDoctorAchievements } = require("../Controller/doctor_controller");

// Routes for requests
router.post("/login", DoctorSignin);
router.get("/fetchAllDoctors", FetchAllDoctors);
router.get("/fetchSingleDoctor/:id", FetchSingleDoctor);
router.post("/updateDoctor/:id", UpdateDoctor);
router.delete("/deleteDoctor/:id", DeleteDoctor);
router.get("/fetchMyAppointments", FetchMyAppointments);
router.get("/fetchHospitalAndDoctorDetails", FetchHospitalAndDoctorDetails);
router.post("/updateEducation", UpdateDoctorEducation);
router.post("/updateExperience", UpdateDoctorExperience);
router.post("/updateAchievements", UpdateDoctorAchievements);


module.exports = router;