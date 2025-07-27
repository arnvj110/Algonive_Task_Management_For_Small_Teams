const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if authHeader is a string before calling startsWith
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No or invalid token provided" });
    }

    const token = authHeader.split(" ")[1]; // Get the token part after 'Bearer'
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            message: "Invalid or expired token",
        error : error
     });
    }
};

module.exports = authMiddleware;
