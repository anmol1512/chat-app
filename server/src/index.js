import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import connectDB from "./lib/db.js"


// PROCESS ENV VARS
dotenv.config()
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/api/auth", authRoute);
app.listen(PORT, () => {
    console.log("Server is running on PORT: "+PORT);
    connectDB();
});