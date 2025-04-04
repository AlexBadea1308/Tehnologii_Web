import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({role:"fan"});
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error in Fetch users:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getUsersbyAdmin = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error in Fetch users:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPlayers =async (req,res)=>{
    try {
        const players = await User.find({role:"player"});
        if(!players){
            return res.status(404).json({ success: false, message: "Players not found" });
        }
        res.status(200).json({ success: true, data: players });
        
    }
    catch (error) {
        console.error("Error in Fetch players:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const createUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!name || !surname || !username || !email || !password || !role) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword, role });

        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error("Error in Create user:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User ID" });
    }

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, surname, username, email } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid User ID" });
    }
  
    try {
      const existingUsername = await User.findOne({ username, _id: { $ne: id } });
      if (existingUsername) {
        return res.status(400).json({ success: false, message: "Username already taken" });
      }
  
      const existingEmail = await User.findOne({ email, _id: { $ne: id } });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, surname, username, email },
        { new: true }
      ).select("-password");
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      console.error("Error in Update profile:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
  
    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a new password' });
    }
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  export const updateRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid User ID" });
    }
  
   
    const allowedRoles = ["fan", "player", "manager", "admin"];
    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role provided" });
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role }, 
        { new: true } 
      ).select("-password");
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      console.error("Error in Update role:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };