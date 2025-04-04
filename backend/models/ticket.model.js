import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
    matchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Match', 
        required: true 
    },
    seatCategory: { 
        type: String, 
        enum: ['VIP', 'Standard', 'General'], 
        required: true 
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    availableTickets: { 
        type: Number, 
        required: true, 
        min: 0 
    }
}, { 
    timestamps: true 
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;