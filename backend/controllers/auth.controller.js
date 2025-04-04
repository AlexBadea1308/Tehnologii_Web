import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "Please fill all fields" 
        });
    }

    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(400).json({ 
                success: false, 
                message: "Password is incorrect" 
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        const userResponse = {
            _id: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json({ 
            success: true, 
            token,
            data: userResponse 
        });
    } catch (error) {
        console.error("Error login", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Error from server" 
        });
    }
};