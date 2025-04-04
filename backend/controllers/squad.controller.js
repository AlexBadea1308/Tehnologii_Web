import MatchSquad from '../models/squad.model.js';
import Match from '../models/match.model.js';
import User from '../models/user.model.js';
import PlayerStats from '../models/playerStats.model.js';
import mongoose from 'mongoose';

export const getAllMatchSquads = async (req, res) => {
    try {
        const squads = await MatchSquad.find()
            .populate('matchId', 'eventDate teams')
            .populate('players.playerId', 'name surname position profileImage')
            .populate('createdBy', 'username');
        res.status(200).json({ success: true, data: squads });
    } catch (error) {
        console.error('Error fetching all squads:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getMatchSquadByMatchId = async (req, res) => {
    const { matchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
        return res.status(400).json({ success: false, message: 'Invalid match ID' });
    }

    try {
        const squad = await MatchSquad.findOne({ matchId })
            .populate('matchId', 'eventDate teams')
            .populate('players.playerId', 'playerId position profileImage')
            .populate('createdBy', 'username');
        if (!squad) {
            return res.status(404).json({ success: false, message: 'Squad not found for this match' });
        }
        res.status(200).json({ success: true, data: squad });
    } catch (error) {
        console.error('Error fetching squad by match ID:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createMatchSquad = async (req, res) => {
    const { matchId, players, formation, status } = req.body;
    if (!matchId || !players || !Array.isArray(players)) {
        return res.status(400).json({ success: false, message: 'Please provide matchId and a valid players array' });
    }

    try {
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ success: false, message: 'Match not found' });
        }

        for (const player of players) {
            if (!mongoose.Types.ObjectId.isValid(player.playerId)) {
                return res.status(400).json({ success: false, message: `Invalid player ID (PlayerStats): ${player.playerId}` });
            }
            // Gasim documentul PlayerStats
            const playerStats = await PlayerStats.findById(player.playerId);
            if (!playerStats) {
                return res.status(400).json({ success: false, message: `PlayerStats not found for playerId: ${player.playerId}` });
            }
            // Verificam User-ul referentiat de playerId din PlayerStats
            const user = await User.findById(playerStats.playerId);
            if (!user || user.role !== 'player') {
                return res.status(400).json({ success: false, message: `User not found or not a player for playerStats.playerId: ${playerStats.playerId}` });
            }
        }

        const newSquad = new MatchSquad({
            matchId,
            players,
            formation: formation || "4-3-3",
            createdBy: req.user?.id || 'default_manager_id',
            status: status || 'draft'
        });

        await newSquad.save();
        res.status(201).json({ success: true, data: newSquad });
    } catch (error) {
        console.error('Error creating squad:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateMatchSquad = async (req, res) => {
    const { id } = req.params;
    const { players, formation, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid squad ID' });
    }

    try {
        const squad = await MatchSquad.findById(id);
        if (!squad) {
            return res.status(404).json({ success: false, message: 'Squad not found' });
        }

        if (players && Array.isArray(players)) {
            for (const player of players) {
                if (!mongoose.Types.ObjectId.isValid(player.playerId)) {
                    return res.status(400).json({ success: false, message: `Invalid player ID (PlayerStats): ${player.playerId}` });
                }
                // Gasim documentul PlayerStats
                const playerStats = await PlayerStats.findById(player.playerId);
                if (!playerStats) {
                    return res.status(400).json({ success: false, message: `PlayerStats not found for playerId: ${player.playerId}` });
                }
                // Verificam User-ul referentiat de playerId din PlayerStats
                const user = await User.findById(playerStats.playerId);
                if (!user || user.role !== 'player') {
                    return res.status(400).json({ success: false, message: `User not found or not a player for playerStats.playerId: ${playerStats.playerId}` });
                }
            }
            squad.players = players;
        }

        if (formation) squad.formation = formation;
        if (status) squad.status = status;

        await squad.save();
        res.status(200).json({ success: true, data: squad });
    } catch (error) {
        console.error('Error updating squad:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteMatchSquad = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid squad ID' });
    }

    try {
        const squad = await MatchSquad.findById(id);
        if (!squad) {
            return res.status(404).json({ success: false, message: 'Squad not found' });
        }

        await squad.deleteOne();
        res.status(200).json({ success: true, message: 'Squad deleted successfully' });
    } catch (error) {
        console.error('Error deleting squad:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};