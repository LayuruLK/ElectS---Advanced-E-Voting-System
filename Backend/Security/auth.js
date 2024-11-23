const jwt = require('jsonwebtoken');
const secretkey = process.env.SECRET_KEY;
const User = require('../models/user')

function verifyToken(req,res,next) {
    try {
        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({message: "No token Provided!"})
        }
        jwt.verify(token.split(" ")[1], secretkey, (err, decoded) => {
            if(err) {
                return res.status(401).json({message: "Unauthorized. Invalid Token"})
            }
            console.log(token);
            console.log(decoded);
            req.user = verified;
            next();
        }) 
    } catch {
        return res.status(401).json({message: "Unauthorized. Invalid Token"})
    }
}

module.exports = {verifyToken}