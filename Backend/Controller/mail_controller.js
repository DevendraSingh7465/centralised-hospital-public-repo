// Packages
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });

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

        // const { to, subject } = req.body;
        const mailOptions = {
            from: '"Adslide" <adslide7@gmail.com>',
            to: email,
            subject: 'Test Email',
            template: 'loginMail',
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Mail sent successfully!', info.messageId);
        res.json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email', error: error.message }); // Send error details for debugging
    }
};

// Send OTP to the signup user 
async function sendOTP(req, res) {
    try {
        // These lines dynamically import the module and use them to send mail.
        const hbsModule = await import('nodemailer-express-handlebars');
        const hbs = hbsModule.default;
        transporter.use('compile', hbs(hbsOptions));

        // Getting Data from frontend
        const { email } = req.params;
        console.log("Sending Mail to ", email);

        // Getting Data from verify_users collection usign email
        const user = await verifyUser.findOne({ email: email });
        console.log("Fetched User Info : ", user);

        const mailOptions = {
            from: '"Adslide" <adslide7@gmail.com>',
            to: email,
            subject: 'Adslide Signup OTP',
            template: 'verificationEmail',
            context: {
                name: user.name,
                otp: user.otp
            }// context is used to add dynamic data in mails
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Mail sent successfully!', info.messageId);
        res.json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email', error: error.message }); 
    }
}
module.exports = {
    loginMail,
    sendOTP
};