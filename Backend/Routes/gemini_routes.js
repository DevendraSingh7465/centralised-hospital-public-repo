// Packages
const express = require("express");
const router = express.Router();

// Controller
const { chat } = require("../Controller/gemini_controller");


// Routes for requests
router.get("/chat", chat);
// router.post("/logout", deleteJWTCookie);

module.exports = router;