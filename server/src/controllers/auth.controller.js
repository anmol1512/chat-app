import userModel from "../models/user.model.js"
import {generateToken} from "../lib/utils.js";
import bcrypt from "bcryptjs"

const signup = async (request,response) =>{
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
                email: newUser.email,
                password: newUser.password
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

const login = (request,response) =>{
    response.send("LOGIN SUCCESSFULL");
};

const logout = (request,response) =>{
    response.send("LOGOUT SUCCESSFULL");
};

export {signup, login, logout};