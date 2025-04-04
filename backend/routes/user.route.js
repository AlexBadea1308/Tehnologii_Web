import express from 'express';
import { 
    createUser, 
    getUsers, 
    updateUser, 
    deleteUser,
    getPlayers,
    updatePassword,
    getUsersbyAdmin,
    updateRole
} from '../controllers/user.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post("/", createUser); 
router.get("/", authMiddleware, getUsers);
router.get("/all-users", authMiddleware,roleMiddleware('admin'),getUsersbyAdmin);
router.delete("/delete/:id", authMiddleware, roleMiddleware('admin'), deleteUser);
router.put("/:id", authMiddleware, roleMiddleware(['fan','player','manager','admin']),updateUser);
router.put("/role/:id", authMiddleware, roleMiddleware('admin'),updateRole);
router.get("/players", authMiddleware, getPlayers);
router.put("/:id/update-password",roleMiddleware(['fan','player','manager','admin']),authMiddleware, updatePassword);

export default router;