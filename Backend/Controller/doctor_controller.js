// Packages
require('dotenv').config({ path: '../.env' });
const argon2 = require('argon2');

// Models
const users = require("../Models/users");
const doctors = require("../Models/doctors");
const hospitals = require("../Models/hospitals");
const treatments = require("../Models/treatments");

// JWT
const { createTokenandSaveCookie, verifyJWT } = require("../JWT/jwt");
const { isAuthenticated } = require("../JWT/fetchJWTdata");


// Handle Singin request
async function DoctorSignin(req, res) {
    const { email, password } = req.body;
    try {
        const doctor = await doctors.findOne({ email });
        if (!doctor) {
            console.log("Invalid Credentials!");
            return res.status(401).json({ message: "Invalid Credentials!" });
        }
        // verify password
        if (password !== doctor.password) {
            console.log("Invalid Credentials!");
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        // For creating JWT Token 
        createTokenandSaveCookie(doctor._id, doctor.user_type, "create", res);
        console.log("Doctor Login Successfull!");
        res.status(200).json(doctor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// fetch all doctors from database
async function FetchAllDoctors(req, res) {
    try {
        const doctors_data = await doctors.find({});

        const doctor_cards = [];
        for (let i = 0; i < doctors_data.length; i++) {
            const hospital_name = await hospitals.findById(doctors_data[i].hospitalId);
            doctor_cards.push({ _id: doctors_data[i]._id, name: doctors_data[i].name, branch: doctors_data[i].branch, hospital: hospital_name.name, gender: doctors_data[i].gender, dob: doctors_data[i].dob, lat:hospital_name.lat, lng:hospital_name.lng });
        }
        // console.log(doctors_data.length);
        console.log("Doctors Fetched Successfully! for patients");
        res.status(200).json(doctor_cards);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch Single Doctor from database
async function FetchSingleDoctor(req, res) {
    try {
        const doctor_data = await doctors.findById(req.params.id);
        res.status(200).json(doctor_data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Update Doctor in Database
async function UpdateDoctor(req, res) {
    const { id } = req.params;
    const { name, email, mobile, gender, dob, branch, address, pincode, city, state } = req.body;
    try {


        const doctor = await doctors.findByIdAndUpdate(id, {
            name: name,
            email: email,
            mobile: mobile,
            gender: gender,
            dob: dob,
            branch: branch,
            address: address,
            pincode: pincode,
            city: city,
            state: state,
        }, { new: true });

        if (!doctor) {
            console.log("Doctor not Updated.");
            return res.status(404).json({ message: "Doctor not found!" });
        }
        console.log("Doctor updated successfully!");
        res.status(200).json(doctor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Delete Doctor from Database
async function DeleteDoctor(req, res) {
    const { id } = req.params;
    try {
        const doctor = await doctors.findByIdAndDelete(id);

        if (!doctor) {
            console.log("Doctor not found.");
            return res.status(404).json({ message: "Doctor not found!" });
        }

        console.log("Doctor deleted successfully!");
        res.status(200).json({ message: "Doctor deleted successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch my appointments
async function FetchMyAppointments(req, res) {
    try {
        const decodedToken = isAuthenticated(req, res);

        const appointments = await treatments.find({ doctorId: decodedToken._id });

        res.status(200).json(appointments);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch Hospital and doctor Details
async function FetchHospitalAndDoctorDetails(req, res) {
    try {
        const decodedToken = isAuthenticated(req, res);
        const doctor = await doctors.find({ _id: decodedToken._id });
        const hospital_id = doctor[0].hospitalId;
        const hospital = await hospitals.find({ _id: hospital_id });
        res.status(200).json({ doctorDetails: doctor, hospitalDetails: hospital });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Update Achievements of Doctor 
async function UpdateDoctorAchievements(req, res) {
    const { achievements } = req.body;
    try {
        const decodedToken = isAuthenticated(req, res);
        const update_doctor = await doctors.findByIdAndUpdate(decodedToken._id, {
            $set: {
                achievements: achievements,
            },
        }, { new: true });
        return res.status(200).json(update_doctor);

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

// Update Education of Doctor 
async function UpdateDoctorEducation(req, res) {
    const { education } = req.body;
    try {
        const decodedToken = isAuthenticated(req, res);
        const update_doctor = await doctors.findByIdAndUpdate(decodedToken._id, {
            $set: {
                education: education,
            },
        }, { new: true });
        return res.status(200).json(update_doctor);

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

// Update Experience of Doctor 
async function UpdateDoctorExperience(req, res) {
    const { experience } = req.body;
    try {
        const decodedToken = isAuthenticated(req, res);
        const update_doctor = await doctors.findByIdAndUpdate(decodedToken._id, {
            $set: {
                experience: experience,
            },
        }, { new: true });
        return res.status(200).json(update_doctor);

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

module.exports = {
    DoctorSignin,
    FetchAllDoctors,
    FetchSingleDoctor,
    UpdateDoctor,
    DeleteDoctor,
    FetchMyAppointments,
    FetchHospitalAndDoctorDetails,
    UpdateDoctorAchievements,
    UpdateDoctorEducation,
    UpdateDoctorExperience,
}

