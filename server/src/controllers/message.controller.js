import { request, response } from "express";
import { messageModel } from "../model/message.model.js";
import { userModel } from "../model/user.model.js";
import { cloudinary } from "../lib/cloudinary.js";

const getAllUsers = async (request, response) => {
    try{
        const userId = request.user._id;
        const users = await userModel.find({_id: {$ne: userId}}).select("-password");
        response.status(200).json(users);

    }
    catch(error){
        console.log("Error in getAllUsers controller: " + error.message);
        response.status(500).json({message: "Internal Server Error"});
    }
};

const getMessages = async (request, response) => {

    try{
        const {id: receiverId} = request.params;
        const senderId = request.user._id;

        const messages = await messageModel.find({
            $or: [
                {senderId: senderId, receiverId: receiverId},
                {senderId: receiverId, receiverId: senderId}
            ]
        });

        response.status(200).json(messages);
    }
    catch(error){
        console.log("Error in getMessages controller: " + error.message);
        response.status(500).json({message: "Internal Server Error"});
    }
};

const sendMessage = async (request, response) => {
    try{
        const senderId = request.user._id;
        const receiverId = request.params.id;
        const {text, image} = request.body;
        if (!text & !image) return response.status(400).json({message: "No data to send"});

        let imageURL = "";
        if (image){
            const imageResponse = await cloudinary.uploader.upload(image);
            if(!imageResponse) return response.status(400).json({message: "ERROR: Error in uploading image"});
            imageURL = imageResponse.secure_url;
        }
       
        const newMessage = new messageModel({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageURL
        });
        if(!newMessage) return response.status(400).json({message: "ERROR: Error in sending message"}); 
        
        await newMessage.save();
        response.status(201).json({message: "Message Sent"});
        
    }
    catch(error){
        console.log("Error in sendMessage controller: " + error.message);
        response.status(500).json({message: "Internal Server Error"});
    }

}

export {getAllUsers, getMessages, sendMessage};

