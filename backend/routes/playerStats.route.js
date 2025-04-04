import express from 'express';
import { 
    getAllPlayerStats, 
    getPlayerStatsById, 
    getStatsByPlayerId, 
    createPlayerStats, 
    updatePlayerStats, 
    deletePlayerStats 
} from '../controllers/playerStats.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(['manager','player','admin']), getAllPlayerStats);
router.get("/:id", authMiddleware, roleMiddleware(['manager','player','admin']), getPlayerStatsById);
router.get("/player/:playerId", authMiddleware, roleMiddleware('player','admin'), getStatsByPlayerId);
router.post("/", authMiddleware, roleMiddleware('admin'), createPlayerStats);
router.put("/:id", authMiddleware, roleMiddleware('admin'), updatePlayerStats);
router.delete("/:id", authMiddleware, roleMiddleware('admin'), deletePlayerStats);

export default router;