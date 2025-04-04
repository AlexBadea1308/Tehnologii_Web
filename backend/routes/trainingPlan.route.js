import express from 'express';
import {
    createTrainingPlan,
    getAllTrainingPlans,
    getTrainingPlanById,
    updateTrainingPlan,
    deleteTrainingPlan
} from '../controllers/trainingPlan.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('manager'),createTrainingPlan);
router.get('/', authMiddleware, roleMiddleware(['manager','player','admin']),getAllTrainingPlans);
router.get('/:id',authMiddleware, roleMiddleware(['manager','player']), getTrainingPlanById);
router.put('/:id', authMiddleware, roleMiddleware('manager'),updateTrainingPlan);
router.delete('/:id',authMiddleware, roleMiddleware('manager'), deleteTrainingPlan);

export default router;