import mongoose from "mongoose";

const playerStatsSchema = mongoose.Schema({
    playerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    goals: { 
        type: Number, 
        default: 0 
    },
    assists: { 
        type: Number, 
        default: 0 
    },
    yellowCards: { 
        type: Number, 
        default: 0 
    },
    redCards: { 
        type: Number, 
        default: 0 
    },
    matchesPlayed: { 
        type: Number, 
        default: 0 
    },
    profileImage: { 
        type: String, 
        default: null
    },
    position: { 
        type: String, 
        enum: ['ST', 'LW', 'RW', 'CM', 'CDM', 'CAM', 'LB', 'RB', 'CB', 'GK', 'LM', 'RM', 'CF'], 
        required: true
    }
}, 
{
    timestamps: true
});

const PlayerStats = mongoose.model("PlayerStats", playerStatsSchema);

export default PlayerStats;