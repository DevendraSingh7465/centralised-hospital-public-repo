const mongoose = require("mongoose");

// Create Schema
const hospitals_schema = new mongoose.Schema({
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
    user_type: {
        type: String,
        required: true,
        enum: ['admin', 'hospital', 'doctor', 'patient'],
        default: "hospital"
    },
    about: {
        type: String,
    },
    achievements: {
        type: [String]
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
    lat: {
        type: Number
    },
    lng: {
        type: Number

    }
},
    {
        timestamps: true
    }
);

// create model
const hospitals = mongoose.model('hospitals', hospitals_schema);
module.exports = hospitals;