import express from "express";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js"

const app = express();

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

app.listen(5001, () => {
    console.log("server is running on 5001");
});