import mongoose from "mongoose"
import dotenv from "dotenv"

// PROCESS ENV VARS
dotenv.config()

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`)
    }
    catch (error){
        console.log(`MongoDB Connection error: ${error}`)
    }
};

export default connectDB;