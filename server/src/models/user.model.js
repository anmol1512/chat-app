import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            trim: true
        },
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            trim: true
        },
        profileImage: {
            type: String,
            default: ""
        }
    },
    {timestamps: true}
);

const userModel = mongoose.model("User", userSchema);
export default userModel;