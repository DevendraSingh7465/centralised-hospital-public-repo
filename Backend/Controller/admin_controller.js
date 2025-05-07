// Packages
require('dotenv').config({ path: '../.env' });
const argon2 = require('argon2');

// Models
const users = require("../Models/users");
const doctors = require("../Models/doctors");
const hospitals = require("../Models/hospitals");
const branches = require("../Models/branches");
const contacts = require("../Models/contacts");
const treatments = require("../Models/treatments");


// Add new Hospital to Database
async function AddHospital(req, res) {
    const { name, email, mobile, address, pincode, city, state, lat, lng } = req.body;
    try {
        const hospital = await hospitals.findOne({
            $or: [
                { name: name },
                { email: email },
                { mobile: mobile }
            ]
        });
        if (hospital) {
            console.log("Name or Email or Mobile already exists.");
            return res.status(400).json({ message: "Hospital already in Database!" });
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
        const hospital_data = await hospitals.create({
            name: name,
            email: email,
            password: password,
            mobile: mobile,
            address: address,
            pincode: pincode,
            city: city,
            state: state,
            lat:lat,
            lng:lng
        });
        console.log("Hospital Addded Successfully!");
        res.status(201).json(hospital_data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get all Hospitals from Database
async function GetHospitals(req, res) {
    try {
        const hospitals_data = await hospitals.find({});
        res.status(200).json(hospitals_data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// update Hospital in Database
async function UpdateHospitalDetails(req, res) {
    const { id } = req.params;
    const { name, email, mobile, address, pincode, city, state } = req.body;
    try {
        const hospital = await hospitals.findByIdAndUpdate(id, {
            name: name,
            email: email,
            mobile: mobile,
            address: address,
            pincode: pincode,
            city: city,
            state: state,
        }, { new: true });

        if (!hospital) {
            console.log("Hospital not Updated.");
            return res.status(404).json({ message: "Hospital not found!" });
        }
        console.log("Hospital updated successfully!");
        res.status(200).json(hospital);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Name, Email or Contact already exists" });
    }
}

// Fetch Single Hospital from Database
async function GetSingleHospital(req, res) {
    const { id } = req.params;
    console.log(req.params);
    try {
        const hospital = await hospitals.findById(id);

        if (!hospital) {
            console.log("Hospital not found.");
            return res.status(404).json({ message: "Hospital not found!" });
        }

        console.log("Hospital fetched successfully!");
        res.status(200).json(hospital);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


// Fetch all doctors from database
async function GetDoctors(req, res) {
    try {
        const doctors_data = await doctors.find({});
        res.status(200).json(doctors_data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch all branches from database

async function GetAllBranches(req, res) {
    try {
        const branches_data = await branches.find({}).distinct('branch');
        res.status(200).json(branches_data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Send Contact us Message 
async function PostContactUsMessage(req, res) {
    const { name, email, message } = req.body;
    try {
        const send_message = await contacts.create({
            name: name,
            email: email,
            message: message
        });
        if (!send_message) {
            console.log("Message not Sent!");
            return res.status(500).json({ message: "Internal Server Error" });
        }

        console.log("Message sent Successfully!");
        res.status(200).json(send_message);

    }
    catch (error) {
        console.log("Message not Sent!");
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch all the users Messages
async function GetContactMessages(req, res) {
    try {
        const messages = await contacts.find({});
        console.log("Message Fetched!");
        return res.status(200).json(messages);
    }
    catch (error) {
        console.log("Message not Fetched!");
        return res.status(500).json({ message: "Internal Server Error!" });
    }
}

// fetch all doctors with hospital name from database
async function FetchAllDoctorsWithHospitalName(req, res) {
    try {
        const doctors_data = await doctors.find({});

        const doctor_cards = [];
        for (let i = 0; i < doctors_data.length; i++) {
            const hospital_name = await hospitals.findById(doctors_data[i].hospitalId);
            doctor_cards.push({
                _id: doctors_data[i]._id,
                name: doctors_data[i].name,
                email: doctors_data[i].email,
                mobile: doctors_data[i].mobile,
                address: doctors_data[i].address,
                pincode: doctors_data[i].pincode,
                state: doctors_data[i].state,
                branch: doctors_data[i].branch,
                hospital: hospital_name.name,
                gender: doctors_data[i].gender,
                dob: doctors_data[i].dob,
                city: doctors_data[i].city,
            });
        }
        // console.log(doctors_data.length);
        console.log("Doctors Fetched Successfully! for Admin");
        res.status(200).json(doctor_cards);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch all doctors appointments
async function FetchAllAppointments(req, res) {
    try {

        const appointments = await treatments.find({});

        res.status(200).json(appointments);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get all Hospitals from Database
async function GetHospitalsforAdmin(req, res) {
    try {
        // const hospitals_data = await hospitals.find({});
        const hospitals_data = hospitals.map(hospital => {
            const doctorCount = doctors.filter(doctor => doctor.hospitalId === hospital.id).length;
            const branchCount = branches.filter(branch => branch.hospitalId === hospital.id).length;

            return {
                _id: hospital.id,
                name: hospital.name,
                email: hospital.email,
                city: hospital.city,
                doctorCount:doctorCount,
                branchCount:branchCount,
            };
        });
        res.status(200).json(hospitals_data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get all Branches with ID
async function GetAllBranchesWithID(req, res) {
    try {
        const branches_data = await branches.find({});
        res.status(200).json(branches_data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = {
    AddHospital,
    GetHospitals,
    UpdateHospitalDetails,
    GetSingleHospital,
    GetDoctors,
    GetAllBranches,
    PostContactUsMessage,
    GetContactMessages,
    FetchAllDoctorsWithHospitalName,
    FetchAllAppointments,
    GetHospitalsforAdmin,
    GetAllBranchesWithID,
};