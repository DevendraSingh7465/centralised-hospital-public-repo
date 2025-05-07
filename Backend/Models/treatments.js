const mongoose = require("mongoose");

// Create Schema
const treatment_schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    branch:{
        type:String,
        required: true,
    },
    patient_name:{
        type: String,
        required: true,
    },
    doctor_name:{
        type: String,
        required: true,
    },
    mobile:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
        enum: ['male', 'female'],
    },
    dob:{
        type: Date,
        required: true,
    },
    appointment:{
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Ongoing', 'Completed', 'Cancelled','Confirmed','Not accepted'],
    },
    problem:{
        type: String,
    },
},
    {
        timestamps: true
    }
);

// create model
const treatments = mongoose.model('treatments', treatment_schema);
module.exports = treatments;