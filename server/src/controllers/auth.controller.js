import userModel from "../models/user.model.js"
import {generateToken} from "../lib/utils.js";
import bcrypt from "bcryptjs"
import {cloudinary} from "../lib/cloudinary.js";

const signup = async (request,response) => {
    const {username, email, password} = request.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    const passwordMinlength = 6;
    
    try{
        //checking validity of the user
        if(!username || !email || !password) return response.status(400).json({message: "*All the fields are required"});
        if(!emailRegex.test(email)) return response.status(400).json({message: "Invalid Email Address"});
        if(!nameRegex.test(username)) return response.status(400).json({message: "Invalid Username - [Should include only alphabets and should have more than 2 character]"});
        if(password.length < passwordMinlength) return response.status(400).json({message: "Password is weak - [Try again with more than 5 character]"});

        //Checking existing user
        const user = await userModel.findOne({email});
        if (user) return response.status(400).json({message: "Email already exists"});

        //Flow for new user
            //created hashed password to store
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
            //creating new user
        const newUser = new userModel(
            {
                username: username,
                email: email,
                password: hashedPassword
            }
        );
        if(newUser){
            await newUser.save(); //  Store it in MongoDB Collection
            const token = generateToken(newUser._id, response) // if data is store in DB then only generate JWT token
            response.status(201).json({
                message: "New user created",
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            });

        }
        else{
            response.status(400).json({message: "Invalid user data"});
        }
    }
    catch(error){
        console.log("Error in signup controller: " + error.message);
        response.status(500).json({message: "Internal Server Error"});
    }
};

const login = async (request,response) => {
    const {email, password} = request.body;
    try{
        // Checking if user has signed up already with the email
        const user = await userModel.findOne({email});
        if(!user) return response.status(400).json({message: "Invalid credentials"});

        //Checking the password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return response.status(400).json({message: "Invalid credentials"});

        // Generate JWT token
        generateToken(user._id, response);

        response.status(200).json({
            message: "User login successfull",
            id: user._id,
            username: user.username,
            email: user.email
        });

    }
    catch(error){
        console.log("Error in login controller: " + error.message);
        response.status(500).json({message: "Internal Server Error"});
    }
    
};

const logout = (request,response) => {
    try{
        response.cookie("jwt", "", {maxAge: 0});
        response.status(200).json({message: "User logout successfull"})
    }
    catch(error){
        console.log("Error in logout controller: " + error.message);
        response.status(500).json({message: "Internal Server Error"});
    }
};

const updateProfile = async (request, response) => {
    try{
        const {profileImage} = request.body;
        if(!profileImage) return response.status(400).json({message: "ERROR: Profile image not found"});

        const imageResponse = await cloudinary.uploader.upload(profileImage);
        if(!imageResponse) return response.status(400).json({message: "ERROR: error uploading profile image"});

        const updatedUser = await userModel.findByIdAndUpdate(request.user._id, {profileImage: imageResponse.secure_url}, {new: true}).select("-password");
        if(!updatedUser) return response.status(400).json({message: "ERROR: Profile image not updated for user"});

        response.status(200).json({
            message: "Profile image updated",
            username: updatedUser.username,
            email: updatedUser.email
        })

    }
    catch(error){
        console.log("Error in updateProfile controller: " + error.message);
        response.status(500).json({message: "Internal Server Error"});
    }
};

const checkAuth = (request, response) => {
    try{
        response.status(200).json(request.user);
    }
    catch(error){
        console.log("Error in checkAuth controller: " + error.message);
        response.status(500).json({message: "Internal Server Error"});
    }
};

export {signup, login, logout, updateProfile, checkAuth};