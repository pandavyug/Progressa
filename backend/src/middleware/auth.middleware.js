const JWT = require("jsonwebtoken");

async function authenticateToken(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized , You must be logged in !!" })
    }

    try{
        const decoded = JWT.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized",err })
    }
  
}

module.exports = { authenticateToken }