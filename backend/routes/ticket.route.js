import express from 'express';
import {
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    updateTicketStock,
    getTicketByTicketId
} from '../controllers/ticket.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTickets);
router.get('/:id/:seatCategory', getTicketById);
router.get('/:ticketId', getTicketByTicketId);

router.post('/', authMiddleware, roleMiddleware('admin'), createTicket);
router.put('/:id', authMiddleware, roleMiddleware(['fan','admin']), updateTicket);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteTicket);
router.post('/stock', authMiddleware, roleMiddleware(['fan','admin']), updateTicketStock);

export default router;