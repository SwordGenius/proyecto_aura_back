const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config()

const verifyAuth = (req, res, next) => {
    try {
        const token = req.cookies.aToken;
        jwt.verify(token, process.env.SECRET, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    message: "error al validar token",
                    error: err.message
                });
            }
            req.usuario = decode.usuario;
            next();
        });

    } catch (error) {
        return res.status(401).json({
            message: "error al validar token",
            error: error.message
        })
    }
}

module.exports = {verifyAuth};