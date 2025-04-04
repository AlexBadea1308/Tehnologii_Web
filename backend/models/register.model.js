import mongoose from "mongoose";

const registerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: { 
        type: String, 
        required: true, 
        unique: true },
    email: { 
        type: String, 
        required: true, 
        unique: true },
    password: { 
        type: String, 
        required: true },
    role: { 
        type: String, 
        enum: ["player", "manager", "admin","fan"],
        default: "fan",
        required: true },
    },
    {
        timestamps: true
});

const Register = mongoose.model("Request", registerSchema);

export default Register;
