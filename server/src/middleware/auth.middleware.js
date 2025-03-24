import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"

const protectRoute = async (request, response, next) => {
    try{
        // Extracting token from cookie
        const token = request.cookies.jwt;
        if(!token) return response.status(401).json({message: "Unauthorized: No token found"});

        // Verifying token
        const cookieInfo = jwt.verify(token, process.env.JWT_SECRET);
        if(!cookieInfo){
            console.log("UserId not found inside token!!!");
            return response.status(401).json({message: "Unauthorized: No token found"});
        }

        // Finding the user
        const user = await userModel.findById(cookieInfo.userId).select("-password");
        if(!user) return response.status(404).json({message: "Unauthorized: User not found"});

        request.user = user;
        next();
    }
    catch(error){
        console.log("Error in protectRoute middleware: " + error.message);
        response.status(500).json({message: "Internal Server Error"});

    }
}

export {protectRoute};