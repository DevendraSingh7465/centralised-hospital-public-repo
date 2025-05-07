// JWT
const { verifyJWT } = require("./jwt");


function isAuthenticated(req, res) {
    // Fetch JWT Token From Browser
    const fetchedToken = req.cookies.jwt;
    if (!fetchedToken) {
        return res.status(401).json({ message: "Unauthorized: Missing JWT token" });
    }

    // Verify JWT Token
    const decodedToken = verifyJWT(fetchedToken);
    if (!decodedToken) {
        return res.status(401).json({ message: "Unauthorized: Invalid JWT token" });
    }
    // console.log("JWT: ", decodedToken);
    return decodedToken;
}


module.exports = {
    isAuthenticated,
}