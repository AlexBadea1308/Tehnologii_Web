import express from 'express';
import {
    createMatchSquad,
    getMatchSquadByMatchId,
    updateMatchSquad,
    deleteMatchSquad
} from '../controllers/squad.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/',authMiddleware, roleMiddleware('manager'),createMatchSquad);
router.get('/match/:matchId',authMiddleware, roleMiddleware(['manager','player']),getMatchSquadByMatchId);
router.put('/:id', authMiddleware, roleMiddleware('manager'),updateMatchSquad);
router.delete('/:id',authMiddleware, roleMiddleware('manager'), deleteMatchSquad);

export default router;