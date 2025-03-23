import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const generateToken = (userId, response) => {

    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    response.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevents from XSS attacks
        sameSite: "strict", // prevents CSRF attacks
        secure: process.env.NODE_ENV != "development"

    })

    return token;

}

export {generateToken};