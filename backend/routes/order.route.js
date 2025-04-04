import express from 'express';
import { 
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    createOrder,
    updateOrder,
    deleteOrder 
} from '../controllers/order.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(['fan','admin']), getAllOrders);
router.get("/:id", authMiddleware, roleMiddleware('fan'), getOrderById);
router.get("/user/:userId", authMiddleware, roleMiddleware('fan'), getOrdersByUserId);
router.post("/", authMiddleware, roleMiddleware('fan'), createOrder);
router.put("/:id", authMiddleware, roleMiddleware('admin'), updateOrder);
router.delete("/:id", authMiddleware, roleMiddleware('admin'), deleteOrder);

export default router;