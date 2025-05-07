// Packages
const express = require("express");
const router = express.Router();

// Controller
const { AddHospital } = require("../Controller/admin_controller");
const { GetHospitals } = require("../Controller/admin_controller");
const { UpdateHospitalDetails } = require("../Controller/admin_controller");
const { GetSingleHospital } = require("../Controller/admin_controller");
const { GetDoctors } = require("../Controller/admin_controller");
const { GetAllBranches } = require("../Controller/admin_controller");
const { PostContactUsMessage } = require("../Controller/admin_controller");
const { GetContactMessages } = require("../Controller/admin_controller");
const { FetchAllDoctorsWithHospitalName } = require("../Controller/admin_controller");
const { FetchAllAppointments } = require("../Controller/admin_controller");
const { GetHospitalsforAdmin } = require("../Controller/admin_controller");
const { GetAllBranchesWithID } = require("../Controller/admin_controller");

// Routes for requests
router.post("/addHospital", AddHospital);
router.get("/GetHospitals", GetHospitals);
router.post("/UpdateHospitalDetails/:id", UpdateHospitalDetails);
router.get("/GetSingleHospital/:id", GetSingleHospital);
router.get("/GetDoctors", GetDoctors);
router.get("/GetAllBranches", GetAllBranches);
router.post("/send", PostContactUsMessage);
router.get("/getMessages", GetContactMessages);
router.get("/getDoctorsWithHospitals", FetchAllDoctorsWithHospitalName);
router.get("/getAllAppointments", FetchAllAppointments);
router.get("/getHospitalsforAdmin", GetHospitalsforAdmin);
router.get("/getAllBranchesWithID", GetAllBranchesWithID);

module.exports = router;