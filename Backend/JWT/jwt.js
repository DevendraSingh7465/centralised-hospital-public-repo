// Packages
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

// Secret JWT Token
const JWT_TOKEN = process.env.secretJWTKey;

function createTokenandSaveCookie(ID, user_type, act, res) {
    let action = act;

    const payload = {
        _id: ID,
        isloggedIn: true,
        role: user_type,
        timestamp: Date.now()
    };
    const token = jwt.sign(payload, JWT_TOKEN);

    let cookieExpireTime;
    if (action == "logout") {
        cookieExpireTime = 1000; // 1 second = 1000 millisecond
    }
    else {
        cookieExpireTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    }
    res.cookie("jwt", token, {
        maxAge: cookieExpireTime,
        httpOnly: true, 
        secure: true,  
        sameSite: process.env.JWT_SameSite,
    });

}

function verifyJWT(token) {
    if (!token) return null;

    try {
        return jwt.verify(token, JWT_TOKEN);
    } catch (error) {
        console.error("JWT Verification Error:", error.message); // Log the error
        return null;
    }
}

module.exports = {
    createTokenandSaveCookie,
    verifyJWT
}
