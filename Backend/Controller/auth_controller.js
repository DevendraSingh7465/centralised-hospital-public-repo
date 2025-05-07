// Packages
require('dotenv').config({ path: '../.env' });
const argon2 = require('argon2');

// Models
const users = require("../Models/users");

// JWT
const { createTokenandSaveCookie, verifyJWT } = require("../JWT/jwt");
const { isAuthenticated } = require("../JWT/fetchJWTdata");


// Sign up request
async function handleUserSignup(req, res) {
    const { name, email, password, mobile, dob, gender, user_type } = req.body;
    try {
        // Check if email already exists in the database
        const patient = await users.findOne({
            $or: [
                { email: email },
                { mobile: mobile }
            ]
        });
        if (patient) {
            console.log("Email or Mobile already exists.");
            return res.status(400).json({ message: "Email or Mobile already exists." });
        }

        // Hasing the password
        const hashedPassword = await argon2.hash(password);

        // Adding data to the database
        const userAdded = await users.create({
            name: name,
            email: email,
            password: hashedPassword,
            mobile: mobile,
            dob: dob,
            gender: gender,
            user_type: user_type,
            is_verified: false,

        })
        console.log("Signup Successfull!")
        res.status(201).json(userAdded);


    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Server Error!", error: error.message });
    }
}

// Sign in request
async function handleUserSignin(req, res) {
    const { email, password } = req.body;
    try {
        const patient = await users.findOne({ email });
        if (!patient) {
            console.log("User not Registered.");
            return res.status(400).json({ message: "User not Registered." });
        }

        // Verify Password and hash
        const match = await argon2.verify(patient.password, password);
        if (!match) {
            console.log("Incorrect Credentials!");
            return res.status(400).json({ message: "Incorrect Credentials!" });
        }

        // For creating JWT Token 
        createTokenandSaveCookie(patient._id, patient.user_type,"create", res);

        console.log("Patient Login Successfull!");
        res.status(200).json(patient);

    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({ message: "Server Error!", error: error.message });
    }

}

// Fetch all the users from database
async function getAllPatients(req, res) {
    try {
        const users_data = await users.find({});
        res.status(200).json(users_data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch JWT Token From Browswer
async function fetchJWT(req, res) {
    // Fetch JWT Token From Browswer
    const fetchedToken = req.cookies.jwt;
    if (!fetchedToken) {
        return res.status(401).json({ message: "Unauthorized: Missing JWT token" });
    }

    // Verify JWT Token
    const decodedToken = verifyJWT(fetchedToken);
    if (!decodedToken) {
        return res.status(401).json({ message: "Unauthorized: Invalid JWT token" });
    }
    else {
        console.log(decodedToken)
        res.status(200).json(decodedToken);
    }
}

// Delete JWT Token From Browswer
async function deleteJWTCookie(req, res) {
    try {
        createTokenandSaveCookie("patient._id", "patient.user_type","logout", res);

        console.log("JWT Token deleted successfully!")
        return res.status(200).json({ message: "JWT Token deleted successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error!" });
    }

}

module.exports = {
    handleUserSignup,
    handleUserSignin,
    getAllPatients,
    fetchJWT,
    deleteJWTCookie
};