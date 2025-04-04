import express from 'express';
import { 
    getProducts, 
    createProduct, 
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductStock
} from '../controllers/product.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, roleMiddleware('admin'), createProduct);
router.put("/:id", authMiddleware, roleMiddleware('admin'), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware('admin'), deleteProduct);
router.post("/stock", authMiddleware, roleMiddleware(['fan','admin']), updateProductStock);

export default router;