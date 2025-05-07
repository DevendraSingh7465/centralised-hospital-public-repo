// Packages
const mongoose = require("mongoose");

// Create Schema
const branches_schema = new mongoose.Schema({
    branch: {
        type: String,
        required: true,
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: false,
    },
},
    {
        timestamps: true
    }
);

// create model
const branches = mongoose.model('branches', branches_schema);
module.exports = branches;