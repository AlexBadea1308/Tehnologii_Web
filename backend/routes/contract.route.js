import express from 'express';
import { 
  getAllContracts,
  getContractById,
  getContractByPlayerId,
  createContract,
  updateContract,
  deleteContract 
} from '../controllers/contract.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get("/",authMiddleware, roleMiddleware(['manager','player']),getAllContracts);
router.get("/:id",authMiddleware, roleMiddleware(['manager','player']), getContractById);
router.get("/player/:playerId",authMiddleware, roleMiddleware('manager','player'), getContractByPlayerId);
router.post("/",authMiddleware, roleMiddleware('manager'), createContract);
router.put("/:id",authMiddleware, roleMiddleware('manager'), updateContract);
router.delete("/:id",authMiddleware, roleMiddleware('manager'), deleteContract);

export default router;