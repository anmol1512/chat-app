import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import connectDB from "./lib/db.js"


dotenv.config() // Load env variables into process.env
const app = express(); // express application
const PORT = process.env.PORT; // Server port where request are listen

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
    });
}

app.use(express.json()); // Built-in middleware which parse json request and loads it into request.body
app.use("/api/auth", authRoute); // Authentication routes
startServer(); // Connecting to MongoDB and starting the server