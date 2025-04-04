import bcrypt from "bcryptjs";
import User from "../models/user.model.js";


export const createRegister = async (req, res) => {
    const { name , surname , username, email, password, role } = req.body;

    if (!name || !surname || !username || !email || !password ) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    try {
     
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name,surname,username, email, password: hashedPassword, role });
            await newUser.save();

        return res.status(201).json({ success: true, message: "Account created successfully", data: newUser });
    } catch (error) {
        console.error("Error creating register request:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};