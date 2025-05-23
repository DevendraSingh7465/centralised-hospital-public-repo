// Packages
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });

// Models
const users = require("../Models/users");
const doctors = require("../Models/doctors");
const hospitals = require("../Models/hospitals");
const branches = require("../Models/branches");
const treatments = require("../Models/treatments");

// Nodemailer Configuration 
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    logger: false,
    auth: {
        user: "adslide7@gmail.com",
        pass: process.env.ADSLIDE_PASS,
    },
    tls: {
        rejectUnauthorized: true
    }
});

// Configure Handlebars(different views of mail) 
const hbsOptions = {
    viewEngine: {
        defaultLayout: false
    },
    viewPath: '../Backend/Views'
};

// Send Test Mail 
const loginMail = async (req, res) => {
    try {
        // These lines dynamically import the module and use them to send mail.
        const hbsModule = await import('nodemailer-express-handlebars');
        const hbs = hbsModule.default;
        transporter.use('compile', hbs(hbsOptions));

        // Getting email from frontend
        const { email } = req.params;
        const user = await users.findOne({ email });

        const mailOptions = {
            from: 'FastMed',
            to: email,
            subject: 'Login Successful!',
            template: 'loginMail',
            context: {
                name: user.name,
            },
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Mail sent successfully!', info.messageId);
        res.json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email', error: error.message }); // Send error details for debugging
    }
};
const contactMail = async (req, res) => {
    try {
        // These lines dynamically import the module and use them to send mail.
        const hbsModule = await import('nodemailer-express-handlebars');
        const hbs = hbsModule.default;
        transporter.use('compile', hbs(hbsOptions));

        // Getting email from frontend
        const { name, email, message } = req.body;

        const mailOptions = {
            from: 'FastMed',
            to: email,
            subject: 'FastMed - Your Inquiry Received',
            template: 'contact',
            context: {
                name: name,
                email: email,
                message: message,
            },
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Mail sent successfully!', info.messageId);
        res.json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email', error: error.message }); // Send error details for debugging
    }
}
const appointmentConfirmed = async (req, res) => {
    try {
        // These lines dynamically import the module and use them to send mail.
        const hbsModule = await import('nodemailer-express-handlebars');
        const hbs = hbsModule.default;
        transporter.use('compile', hbs(hbsOptions));

        // Getting id of patient from frontend
        const { id } = req.params;
        const patient = await treatments.findById(id);
        const hospital = await hospitals.findById(patient.hospitalId);
        const user = await users.findById(patient.userId);
        const email = user.email;

        const { date, time } = splitDateTime(patient.appointment);

        const mailOptions = {
            from: 'FastMed',
            to: "devendrasingh7465@gmail.com",
            subject: 'FastMed - Appointment Confirmed!',
            template: 'appointmentAccepted',
            context: {
                PatientName: patient.patient_name,
                DoctorName: patient.doctor_name,
                AppointmentDate: date,
                AppointmentTime: time,
                HospitalName: hospital.name,
                HospitalAddress: hospital.address,
            },
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Mail sent successfully!', info.messageId);
        res.json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email', error: error.message }); // Send error details for debugging
    }
}

function splitDateTime(dateTimeString) {
    const dateObj = new Date(dateTimeString);

    // Options for date formatting (e.g., "21 May 2025")
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = dateObj.toLocaleDateString('en-GB', dateOptions);

    // Extract time in 24-hour format (HH:MM)
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;

    return { date, time };
}






module.exports = {
    loginMail,
    contactMail,
    appointmentConfirmed,
};