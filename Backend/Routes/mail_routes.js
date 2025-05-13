// Packages
const express = require("express");
const router = express.Router();

// Controller
const { loginMail } = require("../Controller/mail_controller");

// Routes for requests
router.get("/login/:email", loginMail); 

// For exporting authRoutes.js if neccessary
module.exports = router;