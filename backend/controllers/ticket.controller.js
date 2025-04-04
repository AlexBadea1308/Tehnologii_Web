import Ticket from '../models/ticket.model.js';
import Match from '../models/match.model.js';
import mongoose from 'mongoose';

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('matchId');
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTicketById = async (req, res) => {
  const { id, seatCategory } = req.params;
  try {
    const query = { matchId: id }; 
    if (seatCategory) {
      query.seatCategory = seatCategory;
    }
    const ticket = await Ticket.findOne(query).populate('matchId');
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    console.error("Error finding ticket:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createTicket = async (req, res) => {
  const { matchId, seatCategory, price, availableTickets } = req.body;

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const newTicket = new Ticket({
      matchId,
      seatCategory,
      price,
      availableTickets,
    });

    await newTicket.save();
    const populatedTicket = await Ticket.findById(newTicket._id).populate('matchId');
    res.status(201).json({ success: true, data: populatedTicket });
  } catch (error) {
    console.error('Error creating ticket:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { matchId, seatCategory, price, availableTickets } = req.body;

  try {
    const updateData = {};
    if (matchId) updateData.matchId = matchId;
    if (seatCategory) updateData.seatCategory = seatCategory;
    if (price !== undefined) updateData.price = price;
    if (availableTickets !== undefined) updateData.availableTickets = availableTickets;

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('matchId');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    console.error('Error updating ticket:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    if (ticket.availableTickets < ticket.availableTickets) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete ticket with sold tickets",
      });
    }

    await ticket.deleteOne();
    res.status(200).json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateTicketStock = async (req, res) => {
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of ticket updates",
    });
  }

  try {
    const updatedTickets = [];

    for (const update of updates) {
      const { ticketId, quantity } = update;

      if (!mongoose.Types.ObjectId.isValid(ticketId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid ticket ID: ${ticketId}`,
        });
      }

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: `Ticket not found: ${ticketId}`,
        });
      }

      if (ticket.availableTickets < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient available tickets for: ${ticket.seatCategory}`,
        });
      }

      ticket.availableTickets -= quantity;
      await ticket.save();
      updatedTickets.push(ticket);
    }

    res.status(200).json({
      success: true,
      data: updatedTickets,
      message: `${updatedTickets.length} tickets stock updated`,
    });
  } catch (error) {
    console.error("Error updating ticket stock:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating ticket stock",
    });
  }
};

export const getTicketByTicketId = async (req, res) => {
  const { ticketId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(ticketId)) {
    return res.status(400).json({ success: false, message: "Invalid ticket ID" });
  }

  try {
    const ticket = await Ticket.findById(new mongoose.Types.ObjectId(ticketId)).populate('matchId');
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};