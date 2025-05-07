// Packages
const mongoose = require("mongoose");

// Create Schema
const contact_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },

},
    {
        timestamps: true
    }
);

// create model
const contacts = mongoose.model('contacts', contact_schema);
module.exports = contacts;