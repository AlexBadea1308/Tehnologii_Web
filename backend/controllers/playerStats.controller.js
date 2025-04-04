import PlayerStats from "../models/playerStats.model.js";
import mongoose from "mongoose";

export const getAllPlayerStats = async (req, res) => {
    try {
        const stats = await PlayerStats.find().populate('playerId', 'username name surname');
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error("Error to obtain statistics: ", error.message);
        res.status(500).json({ success: false, message: "Error from server" });
    }
};

export const getPlayerStatsById = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "ID invalid" });
    }
    
    try {
        const stats = await PlayerStats.findById(id).populate('playerId', 'username name surname');
        if (!stats) {
            return res.status(404).json({ success: false, message: "Statistics not found" });
        }
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error("Error to find the statistics: ", error.message);
        res.status(500).json({ success: false, message: "Error from server" });
    }
};

export const getStatsByPlayerId = async (req, res) => {
    const { playerId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
        return res.status(404).json({ success: false, message: "ID invalid player" });
    }
    
    try {
        const stats = await PlayerStats.findOne({ playerId }).populate('playerId', 'username name surname');
        if (!stats) {
            return res.status(404).json({ success: false, message: "The statistics for this player were not found" });
        }
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error("Error found the statistics :", error.message);
        res.status(500).json({ success: false, message: "Error from server" });
    }
};

export const createPlayerStats = async (req, res) => {
    const { playerId, position, matchesPlayed, goals, assists, yellowCards, redCards, profileImage } = req.body;
  
    if (!playerId || !position) {
      return res.status(400).json({ success: false, message: "Player ID and position are required" });
    }
  
    try {
      const existingStats = await PlayerStats.findOne({ playerId });
      if (existingStats) {
        return res.status(400).json({ success: false, message: "Statistics for this player already exist. Use PUT to update." });
      }
  
      const newStats = new PlayerStats({
        playerId,
        position,
        matchesPlayed: matchesPlayed || 0,
        goals: goals || 0,
        assists: assists || 0,
        yellowCards: yellowCards || 0,
        redCards: redCards || 0,
        profileImage: profileImage || ''
      });
  
      await newStats.save();
      const populatedStats = await PlayerStats.findById(newStats._id).populate('playerId', 'username name surname');
      res.status(201).json({ success: true, data: populatedStats });
    } catch (error) {
      console.error("Error creating statistics:", error.message);
      res.status(500).json({ success: false, message: "Error from server" });
    }
  };
  
  export const updatePlayerStats = async (req, res) => {
    const { id } = req.params;
    const { position, matchesPlayed, goals, assists, yellowCards, redCards, profileImage } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "ID invalid" });
    }
  
    try {
      const updatedStats = await PlayerStats.findByIdAndUpdate(
        id,
        { position, matchesPlayed, goals, assists, yellowCards, redCards, profileImage },
        { new: true, runValidators: true }
      ).populate('playerId', 'username name surname');
  
      if (!updatedStats) {
        return res.status(404).json({ success: false, message: "Statistics not found" });
      }
  
      res.status(200).json({ success: true, data: updatedStats });
    } catch (error) {
      console.error("Error updating statistics:", error.message);
      res.status(500).json({ success: false, message: "Error from server" });
    }
  };

export const deletePlayerStats = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "ID invalid" });
    }
    
    try {
        const deletedStats = await PlayerStats.findByIdAndDelete(id);
        if (!deletedStats) {
            return res.status(404).json({ success: false, message: "Statistics not found" });
        }
        res.status(200).json({ success: true, message: "Statistics deleted successfully" });
    } catch (error) {
        console.error("Error deleting statistics:", error.message);
        res.status(500).json({ success: false, message: "Error from server" });
    }
};