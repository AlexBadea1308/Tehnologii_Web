import Match from '../models/match.model.js';
import Ticket from '../models/ticket.model.js';

export const getMatches = async (req, res) => {
    try {
        const matches = await Match.find();
        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        console.error("Error fetching matches:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getMatchById = async (req, res) => {
    const { id } = req.params;
    try {
        const match = await Match.findById(id);
        if (!match) {
            return res.status(404).json({ success: false, message: "Match not found" });
        }
        res.status(200).json({ success: true, data: match });
    } catch (error) {
        console.error("Error finding match:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getSquadByMatchId = async (req, res) => {
    try {
      const squad = await MatchSquad.findOne({ matchId: req.params.matchId })
        .populate({
          path: 'players.playerId', // Populate PlayerStats
          populate: {
            path: 'playerId', // Nested populate User from PlayerStats
            model: 'User',
            select: 'name surname', // Only fetch name and surname
          },
        })
        .exec();
  
      if (!squad) {
        return res.status(404).json({ success: false, message: 'Squad not found' });
      }
  
      res.status(200).json({ success: true, data: squad });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

export const createMatch = async (req, res) => {
    const { eventDate, teams, location, competition, description, image } = req.body;

    try {
        const newMatch = new Match({
            eventDate,
            teams,
            location,
            competition,
            description,
            image
        });
        await newMatch.save();
        res.status(201).json({ success: true, data: newMatch });
    } catch (error) {
        console.error("Error creating match:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateMatch = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const match = await Match.findByIdAndUpdate(id, updates, { 
            new: true, 
            runValidators: true 
        });
        if (!match) {
            return res.status(404).json({ success: false, message: "Match not found" });
        }
        res.status(200).json({ success: true, data: match });
    } catch (error) {
        console.error("Error updating match:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteMatch = async (req, res) => {
    const { id } = req.params;

    try {
        const tickets = await Ticket.find({ matchId: id });
        if (tickets.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete match with existing tickets" 
            });
        }

        const match = await Match.findByIdAndDelete(id);
        if (!match) {
            return res.status(404).json({ success: false, message: "Match not found" });
        }
        res.status(200).json({ success: true, message: "Match deleted successfully" });
    } catch (error) {
        console.error("Error deleting match:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};