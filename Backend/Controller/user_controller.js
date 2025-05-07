// Packages
require('dotenv').config({ path: '../.env' });

// Models
const users = require("../Models/users");
const doctors = require("../Models/doctors");
const hospitals = require("../Models/hospitals");
const branches = require("../Models/branches");
const treatments = require("../Models/treatments");

// JWT
const { isAuthenticated } = require("../JWT/fetchJWTdata");

// Book Appointment
async function bookAppointment(req, res) {
    const { patient_name, mobile, gender, dob, appointment, problem, doctorId, doctor_name } = req.body;
    console.log(req.body)
    try {
        const decodedToken = isAuthenticated(req, res);

        const doctor = await doctors.findById(doctorId);

        const patient = await treatments.create({
            patient_name: patient_name,
            mobile: mobile,
            gender: gender,
            dob: dob,
            appointment: appointment,
            problem: problem,
            userId: decodedToken._id,
            hospitalId: doctor.hospitalId,
            doctorId: doctorId,
            status: "Pending",
            branch: doctor.branch,
            doctor_name: doctor_name,
        });
        console.log("Appointment Booked Successfully!");
        res.status(201).json(patient);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch all Appointments of the user
async function fetchAppointments(req, res) {
    try {
        const decodedToken = isAuthenticated(req, res);

        const appointments = await treatments.find({ userId: decodedToken._id });

        res.status(200).json(appointments);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Update the status of an appointment
async function updateAppointmentStatus(req, res) {
    const { status } = req.body;
    const { id } = req.params;
    // const id = "67fbcec68197cd402fbdc571";
    try {
        const patient = await treatments.findByIdAndUpdate(id, {
            status: status,
        }, { new: true });
        if (!patient) {
            console.log("Patient not found.");
            res.status(404).json({ message: "Patient not found!" });
        }
        console.log("Appointment status updated successfully!");
        res.status(200).json(patient);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch Single user information
async function fetchSingleUser(req, res) {
    try {
        const decodedToken = isAuthenticated(req, res);
        const id = decodedToken._id;

        const user = await users.findById(id);
        if (!user) {
            console.log("User not found.");
            res.status(404).json({ message: "User not found!" });
        }
        console.log("User fetched successfully!");
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch Hospital and doctor Details
async function FetchHospitalAndDoctorDetails(req, res) {
    const { id } = req.params;
    try {
        const doctor = await doctors.find({ _id: id });
        const hospital_id = doctor[0].hospitalId;
        const hospital = await hospitals.find({ _id: hospital_id });
        res.status(200).json({ doctorDetails: doctor, hospitalDetails: hospital });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}




module.exports = {
    bookAppointment,
    fetchAppointments,
    updateAppointmentStatus,
    fetchSingleUser,
    FetchHospitalAndDoctorDetails,
}