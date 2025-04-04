import mongoose from "mongoose";

const contractSchema = mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  releaseClause: {
    type: String,
    default: "No Release Clause"
  },
  contractLength: {
    type: Number, // in ani
    required: true
  },
  salaryPerWeek: {
    type: Number,
    required: true
  },
  bonusPerGoal: {
    type: Number,
    default: 0
  },
  squadRole: {
    type: String,
    enum: ['Crucial', 'Important', 'Rotation', 'Sporadic', 'Do Not Specify'],
    default: 'Do Not Specify'
  },
}, {
  timestamps: true
});

const Contract = mongoose.model("Contract", contractSchema);

export default Contract;