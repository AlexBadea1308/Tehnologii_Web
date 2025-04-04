import TrainingPlan from '../models/trainingPlan.model.js';
import Match from '../models/match.model.js';
import mongoose from 'mongoose';

export const getAllTrainingPlans = async (req, res) => {
    try {
      const plans = await TrainingPlan.find()
        .populate('matchId', 'eventDate teams')
        .populate('createdBy', 'name surname');
      res.status(200).json({ success: true, data: plans });
    } catch (error) {
      console.error('Error fetching training plans:', error.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  export const getTrainingPlanById = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid training plan ID' });
    }
  
    try {
      const plan = await TrainingPlan.findById(id)
        .populate('matchId', 'eventDate teams')
        .populate('createdBy', 'name surname');
      if (!plan) {
        return res.status(404).json({ success: false, message: 'Training plan not found' });
      }
      res.status(200).json({ success: true, data: plan });
    } catch (error) {
      console.error('Error fetching training plan:', error.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

export const createTrainingPlan = async (req, res) => {
    const { matchId, title, description, date, duration, exercises } = req.body;

    if (!title || !description || !date || !duration) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields (title, description, date, duration)' });
    }

    try {
        if (matchId && !mongoose.Types.ObjectId.isValid(matchId)) {
            return res.status(400).json({ success: false, message: 'Invalid match ID' });
        }

        if (matchId) {
            const match = await Match.findById(matchId);
            if (!match) {
                return res.status(404).json({ success: false, message: 'Match not found' });
            }
        }

        if (exercises && !Array.isArray(exercises)) {
            return res.status(400).json({ success: false, message: 'Exercises must be an array' });
        }

        const newPlan = new TrainingPlan({
            matchId: matchId || null,
            title,
            description,
            date,
            duration,
            exercises: exercises || [],
            createdBy: req.user?.id || 'default_manager_id'
        });

        await newPlan.save();
        res.status(201).json({ success: true, data: newPlan });
    } catch (error) {
        console.error('Error creating training plan:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateTrainingPlan = async (req, res) => {
    const { id } = req.params;
    const { matchId, title, description, date, duration, exercises } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid training plan ID' });
    }

    try {
        const plan = await TrainingPlan.findById(id);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Training plan not found' });
        }

        if (matchId && !mongoose.Types.ObjectId.isValid(matchId)) {
            return res.status(400).json({ success: false, message: 'Invalid match ID' });
        }

        if (matchId) {
            const match = await Match.findById(matchId);
            if (!match) {
                return res.status(404).json({ success: false, message: 'Match not found' });
            }
            plan.matchId = matchId;
        }

        if (title) plan.title = title;
        if (description) plan.description = description;
        if (date) plan.date = date;
        if (duration) plan.duration = duration;
        if (exercises && Array.isArray(exercises)) plan.exercises = exercises;

        await plan.save();
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        console.error('Error updating training plan:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteTrainingPlan = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid training plan ID' });
    }

    try {
        const plan = await TrainingPlan.findById(id);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Training plan not found' });
        }

        await plan.deleteOne();
        res.status(200).json({ success: true, message: 'Training plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting training plan:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};