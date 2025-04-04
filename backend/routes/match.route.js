import express from 'express';
import { 
    getMatches, 
    getMatchById, 
    createMatch, 
    updateMatch, 
    deleteMatch,
    getSquadByMatchId
} from '../controllers/match.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();


router.get('/',getMatches);
router.get('/:id',getMatchById);
router.post('/create-match', authMiddleware, roleMiddleware('admin'),createMatch);
router.put('/:id', authMiddleware, roleMiddleware('admin'),updateMatch);
router.delete('/:id',authMiddleware, roleMiddleware('admin'), deleteMatch);
router.get('/:id',authMiddleware, roleMiddleware(['manager','player']),getSquadByMatchId);
export default router;