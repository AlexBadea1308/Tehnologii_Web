import Contract from "../models/contract.model.js";
import mongoose from "mongoose";

export const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().populate('playerId', 'username');
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    console.error("Error retrieving contracts:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getContractById = async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid contract ID" });
  }
  
  try {
    const contract = await Contract.findById(id).populate('playerId', 'username');
    
    if (!contract) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }
    
    res.status(200).json({ success: true, data: contract });
  } catch (error) {
    console.error("Error finding contract:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getContractByPlayerId = async (req, res) => {
  const { playerId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(playerId)) {
    return res.status(404).json({ success: false, message: "Invalid player ID" });
  }
  
  try {
    const contract = await Contract.findOne({ playerId }).populate('playerId', 'username');
    
    if (!contract) {
      return res.status(404).json({ success: false, message: "Contract for this player not found" });
    }
    
    res.status(200).json({ success: true, data: contract });
  } catch (error) {
    console.error("Error retrieving contract:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createContract = async (req, res) => {
  const { playerId, startDate, endDate, releaseClause, contractLength, salaryPerWeek, bonusPerGoal, squadRole } = req.body;

  if (!playerId || !startDate || !endDate || !contractLength || !salaryPerWeek) {
    return res.status(400).json({ success: false, message: "All required fields must be provided" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ success: false, message: "Invalid player ID" });
    }

    const userExists = await mongoose.model('User').findById(playerId);
    if (!userExists) {
      return res.status(400).json({ success: false, message: "User with this ID does not exist" });
    }

    const existingContract = await Contract.findOne({ playerId });
    if (existingContract) {
      return res.status(400).json({ 
        success: false, 
        message: "This player already has a contract. Please update the existing contract." 
      });
    }

    const newContract = new Contract({
      playerId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      releaseClause: releaseClause || "No Release Clause", // String default
      contractLength,
      salaryPerWeek,
      bonusPerGoal: bonusPerGoal || 0,
      squadRole: squadRole || 'Do Not Specify'
    });

    if (newContract.endDate <= newContract.startDate) {
      return res.status(400).json({ 
        success: false, 
        message: "The end date must be later than the start date" 
      });
    }

    await newContract.save();
    res.status(201).json({ success: true, data: newContract });
  } catch (error) {
    console.error("Error creating contract:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateContract = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid contract ID" });
  }

  if (updates.startDate && updates.endDate) {
    const startDate = new Date(updates.startDate);
    const endDate = new Date(updates.endDate);
    if (endDate <= startDate) {
      return res.status(400).json({ 
        success: false, 
        message: "The end date must be later than the start date" 
      });
    }
  } else if (updates.startDate && !updates.endDate) {
    const contract = await Contract.findById(id);
    const startDate = new Date(updates.startDate);
    if (contract && startDate >= contract.endDate) {
      return res.status(400).json({ 
        success: false, 
        message: "The new start date must be earlier than the existing end date" 
      });
    }
  } else if (!updates.startDate && updates.endDate) {
    const contract = await Contract.findById(id);
    const endDate = new Date(updates.endDate);
    if (contract && endDate <= contract.startDate) {
      return res.status(400).json({ 
        success: false, 
        message: "The new end date must be later than the existing start date" 
      });
    }
  }

  try {
    const updatedContract = await Contract.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    ).populate('playerId', 'username');

    if (!updatedContract) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }

    res.status(200).json({ success: true, data: updatedContract });
  } catch (error) {
    console.error("Error updating contract:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteContract = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid contract ID" });
  }

  try {
    const deletedContract = await Contract.findByIdAndDelete(id);

    if (!deletedContract) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }

    res.status(200).json({ success: true, message: "Contract successfully deleted" });
  } catch (error) {
    console.error("Error deleting contract:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};