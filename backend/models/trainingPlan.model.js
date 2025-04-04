import mongoose from "mongoose";

const trainingPlanSchema = mongoose.Schema({
    matchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Match', 
        default: null 
    },
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    duration: { 
        type: Number, 
        required: true 
    },
    exercises: [{
        name: { type: String, required: true },
        description: { type: String },
        duration: { type: Number }
    }],
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

const TrainingPlan = mongoose.model("TrainingPlan", trainingPlanSchema);
export default TrainingPlan;