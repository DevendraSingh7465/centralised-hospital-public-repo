const mongoose = require("mongoose");
const hospitals = require("./hospitals");

// Create Schema
const doctors_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true

    },
    user_type: {
        type: String,
        required: true,
        enum: ['admin', 'hospital', 'doctor', 'patient'],
        default: "doctor"
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hospitals',
        required: true,
    },
    branch: {
        type: String,
        required: true
    },
    education: {
        type: [String],
        
    },
    experience: {
        type: [String],
        
    },
    achievements: {
        type: [String]
    },
    is_on_leave: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    }
);

// create model
const doctors = mongoose.model('doctors', doctors_schema);
module.exports = doctors;