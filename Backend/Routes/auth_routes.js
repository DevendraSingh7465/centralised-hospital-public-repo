// Packages
const express = require("express");
const router = express.Router();

// Controller
const { handleUserSignup } = require("../Controller/auth_controller");
const { handleUserSignin } = require("../Controller/auth_controller");
const { getAllPatients } = require("../Controller/auth_controller");
const { fetchJWT } = require("../Controller/auth_controller");
const { deleteJWTCookie } = require("../Controller/auth_controller");

// Routes for requests
router.post("/signup", handleUserSignup);
router.post("/signin", handleUserSignin);
router.get("/getAllUsers", getAllPatients);
router.get("/jwt", fetchJWT);
router.post("/logout", deleteJWTCookie);

module.exports = router;