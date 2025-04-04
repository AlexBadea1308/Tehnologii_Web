import mongoose from "mongoose";

const matchSchema = mongoose.Schema({
    eventDate: { 
        type: Date, 
        required: true 
    },
    teams: { 
        type: [String], 
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length >= 2;
            },
            message: 'At least two teams are required'
        }
    },
    location: { 
        type: String, 
        required: true 
    },
    competition: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    image: { 
        type: String 
    }
}, {
    timestamps: true
});

const Match = mongoose.model("Match", matchSchema);

export default Match;