import mongoose from "mongoose";

const userSchema = mongoose.Schema({
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
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },  // Parola criptata cu bcrypt
    role: { 
        type: String, 
        enum: ["fan", "player", "manager", "admin"], 
        default: "fan",
        required: true
    }
}, 
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;