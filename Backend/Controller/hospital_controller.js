// Packages
require('dotenv').config({ path: '../.env' });
const argon2 = require('argon2');


// Models
const users = require("../Models/users");
const doctors = require("../Models/doctors");
const hospitals = require("../Models/hospitals");
const branches = require("../Models/branches");
const treatments = require("../Models/treatments");

// JWT
const { createTokenandSaveCookie, verifyJWT } = require("../JWT/jwt");
const { isAuthenticated } = require("../JWT/fetchJWTdata");


// Handle Singin request
async function handleHospitalSignin(req, res) {
    const { email, password } = req.body;
    try {
        const hospital = await hospitals.findOne({ email });
        if (!hospital) {
            console.log("Invalid Credentials!");
            return res.status(401).json({ message: "Invalid Credentials!" });
        }
        // verify password
        if (hospital.password !== password) {
            console.log("Invalid Credentials!");
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        // For creating JWT Token 
        createTokenandSaveCookie(hospital._id, hospital.user_type,"create", res);
        console.log("Hospital Login Successfull!");
        res.status(200).json(hospital);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Add new Doctor
async function addDoctor(req, res) {
    const { name, email, mobile, dob, gender, address, pincode, city, state, branch } = req.body;
    try {
        const decodedToken = isAuthenticated(req, res);

        // Testing ID
        // const _id = "67f4cc8235284e3a41c26ae8";

        // JWT Fetched Hospital ID
        const _id = decodedToken._id;

        const doctor = await doctors.findOne({
            $or: [
                { email: email },
                { mobile: mobile }
            ]
        });
        if (doctor) {
            console.log("Email or Mobile already exists.");
            return res.status(400).json({ message: "Doctor already in Database!" });
        }

        // Generating a random password for the hospital
        const random_digits = Math.floor(1000 + Math.random() * 9000);
        let random_lowercase_alphabets = '';
        const lowercase_characters = 'abcdefghijklmnopqrstuvwxyz';
        const charactersLength = lowercase_characters.length;
        for (let i = 0; i < 4; i++) {
            random_lowercase_alphabets += lowercase_characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        const password = random_lowercase_alphabets + random_digits + random_lowercase_alphabets.toUpperCase() + random_digits;

        // Adding data to the database
        const doctor_data = await doctors.create({
            name: name,
            email: email,
            password: password,
            mobile: mobile,
            dob: dob,
            gender: gender,
            address: address,
            pincode: pincode,
            city: city,
            state: state,
            hospitalId: _id,
            branch: branch,
        });
        console.log("Doctor Addded Successfully!");
        res.status(201).json(doctor_data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// fetch doctors of a hospital from database
async function hospitalDoctors(req, res) {
    try {
        const decodedToken = isAuthenticated(req, res);

        // Now get all the doctors of the hospital with decodedToken._id
        const doctors_data = await doctors.find({ hospitalId: decodedToken._id });
        // const doctors_data = await doctors.find({ hospitalId: "67f43ed3bbd77b00b022f1e3" });
        if (!doctors_data) {
            return res.status(404).json({ message: "No doctors found for this hospital!" });
        }
        console.log("Doctors List: ", doctors_data);

        res.status(200).json(doctors_data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Add new Branch to hospital
async function addBranch(req, res) {
    const { branch } = req.body;
    try {
        const decodedToken = isAuthenticated(req, res);

        // JWT Fetched Hospital ID
        const _id = decodedToken._id;

        // // For Testing ID
        // const _id = "67f43ed3bbd77b00b022f1e3";
        // const _id = "67f4cc8235284e3a41c26ae8";


        const branch_exists = await branches.findOne({ branch: branch, hospitalId: _id });
        if (branch_exists) {
            console.log("Branch already exists!");
            return res.status(400).json({ message: "Branch already exists!" });
        }

        const branch_data = await branches.create({
            branch: branch,
            hospitalId: _id,
        });
        if (!branch_data) {
            console.log("Failed to add branch!");
            res.status(400).json({ message: "Failed to add branch!" });
        }

        console.log("Branch Added Successfully!");
        res.status(201).json(branch_data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch brnaches of single hospital from database
async function fetchHospitalBranches(req, res) {
    try {

        const decodedToken = isAuthenticated(req, res);

        // JWT Fetched Hospital ID
        const _id = decodedToken._id;

        // For Testing ID
        // const _id = "67f43ed3bbd77b00b022f1e3";

        const branches_data = await branches.find({ hospitalId: _id });
        if (!branches_data) {
            return res.status(404).json({ message: "No branches found!" });
        }
        console.log("Branches List: ", branches_data);
        res.status(200).json(branches_data);
    } catch (error) {
        console.log("Internal Server Error!");
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

//  Delete branch from hospital
async function deleteBranch(req, res) {
    const { id } = req.params;
    try {
        const branch = await branches.findByIdAndDelete(id);

        if (!branch) {
            console.log("Branch not found.");
            return res.status(404).json({ message: "Branch not found!" });
        }

        console.log("Branch deleted successfully!");
        res.status(200).json({ message: "Branch deleted successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch patients of hospital
async function fetchPatients(req, res) {
    try {
        const decodedToken = isAuthenticated(req, res);
        // JWT Fetched Hospital ID
        const _id = decodedToken._id;
        console.log("Fetching patients of ", _id);

        const patients_Data = await treatments.find({ hospitalId: _id });
        if (!patients_Data) {
            console.log("No patients found!")
            return res.status(404).json({ message: "Patients not found!" });
        }
        console.log("Hospital patients fetched successfully!");
        res.status(200).json(patients_Data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch Single hospital Details for Profile
async function fetchHospitalDetails(req, res) {
    try {
        const decodedToken = isAuthenticated(req, res);
        // JWT Fetched Hospital ID
        const _id = decodedToken._id;
        console.log("Fetching Hospital details of", _id);

        const hospital_data = await hospitals.find({ _id: _id });
        if (!hospital_data) {
            console.log("No hospital found!")
            return res.status(404).json({ message: "hospital not found!" });
        }
        console.log("Hospital data fetched successfully!");
        res.status(200).json(hospital_data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// update About Section of Hospital 
async function UpdateHospitalAboutSection(req, res) {
    const { about } = req.body;
    try {
        const decodedToken = isAuthenticated(req, res);
        const update_hospital = await hospitals.findByIdAndUpdate(decodedToken._id, {
            about: about
        }, { new: true });
        return res.status(200).json(update_hospital);

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

// Add Achievements of Hospitals 
async function UpdateHospitalAchievements(req, res) {
    const { achievements } = req.body;
    try {
        const decodedToken = isAuthenticated(req, res);
        const update_hospital = await hospitals.findByIdAndUpdate(decodedToken._id, {
            $set: {
                achievements: achievements,
            },
        }, { new: true });
        return res.status(200).json(update_hospital);

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

module.exports = {
    handleHospitalSignin,
    addDoctor,
    hospitalDoctors,
    addBranch,
    fetchHospitalBranches,
    deleteBranch,
    fetchPatients,
    fetchHospitalDetails,
    UpdateHospitalAboutSection,
    UpdateHospitalAchievements,
}

