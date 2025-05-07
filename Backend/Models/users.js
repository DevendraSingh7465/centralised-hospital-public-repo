const mongoose = require("mongoose");

// Create Schema
const users_schema = new mongoose.Schema({
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
    user_type: {
        type: String,
        required: true,
        enum: ['admin', 'hospital', 'doctor', 'patient'],
        default: "patient"
    },
    is_verified:{
        type: Boolean,
        default: false
    }
},
    {
        timestamps : true
    }
);

// create model
const users = mongoose.model('users', users_schema);
module.exports = users;