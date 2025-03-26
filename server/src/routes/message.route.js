import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js"
import {getAllUsers, getMessages, sendMessage} from "../controllers/message.controller.js";

const route = express.Router();

route.get("/users", protectRoute, getAllUsers);

route.get("/:id", protectRoute, getMessages);

route.post("/send/:id", protectRoute, sendMessage);

export default route;