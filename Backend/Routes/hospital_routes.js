// Packages
const express = require("express");
const router = express.Router();

// Controller
const { handleHospitalSignin } = require("../Controller/hospital_controller");
const { addDoctor } = require("../Controller/hospital_controller");
const { hospitalDoctors } = require("../Controller/hospital_controller");
const { addBranch } = require("../Controller/hospital_controller");
const { fetchHospitalBranches } = require("../Controller/hospital_controller");
const { deleteBranch } = require("../Controller/hospital_controller");
const { fetchPatients } = require("../Controller/hospital_controller");
const { fetchHospitalDetails } = require("../Controller/hospital_controller");
const { UpdateHospitalAboutSection } = require("../Controller/hospital_controller");
const { UpdateHospitalAchievements } = require("../Controller/hospital_controller");

// Routes for requests
router.post("/login", handleHospitalSignin);
router.post("/addDoctor", addDoctor);
router.get("/getDoctors", hospitalDoctors);
router.post("/addBranch", addBranch);
router.get("/fetchHospitalBranches", fetchHospitalBranches);
router.delete("/deleteBranch/:id", deleteBranch);
router.get("/fetchPatients", fetchPatients);
router.get("/fetchHospitalDetails", fetchHospitalDetails);
router.post("/updateAbout", UpdateHospitalAboutSection);
router.post("/updateAchievements", UpdateHospitalAchievements);

module.exports = router;