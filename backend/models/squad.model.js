import mongoose from "mongoose";

const matchSquadSchema = mongoose.Schema({
    matchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Match', 
        required: true 
    },
    players: [{
        playerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'PlayerStats', 
            required: true 
        },
        position: { 
            type: String, 
            required: true 
        },
        isStarter: { 
            type: Boolean, 
            default: false 
        }
    }],
    formation: {
        type: String,
        required: true,
        default: "4-3-3"
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['draft', 'published'], 
        default: 'draft' 
    }
}, { timestamps: true });

const MatchSquad = mongoose.model("MatchSquad", matchSquadSchema);
export default MatchSquad;