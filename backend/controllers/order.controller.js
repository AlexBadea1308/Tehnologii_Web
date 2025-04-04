import Order from "../models/order.model.js";
import mongoose from "mongoose";

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'username email');
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error retrieving orders:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getOrderById = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid order ID" });
    }
    
    try {
        const order = await Order.findById(id).populate('userId', 'username email');
        
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error("Error finding order:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getOrdersByUserId = async (req, res) => {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ success: false, message: "Invalid user ID" });
    }
    
    try {
        const orders = await Order.find({ userId })
            .sort({ orderDate: -1 })
            .populate('userId', 'username email');
        
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error finding orders:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const createOrder = async (req, res) => {
    const { 
        userId, 
        items, 
        totalPrice, 
        paymentMethod, 
        shippingMethod, 
        shippingAddress 
    } = req.body;

    
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: "Order must contain at least one item" });
    }

    if (!totalPrice) {
        return res.status(400).json({ success: false, message: "Total price is required" });
    }

    if (!paymentMethod) {
        return res.status(400).json({ success: false, message: "Payment method is required" });
    }

    if (!shippingMethod) {
        return res.status(400).json({ success: false, message: "Shipping method is required" });
    }

    if (!shippingAddress || 
        !shippingAddress.street || 
        !shippingAddress.city || 
        !shippingAddress.postalCode || 
        !shippingAddress.phone ||
        !shippingAddress.country) {
        return res.status(400).json({ success: false, message: "Complete shipping address is required" });
    }

    try {
        const newOrder = new Order({
            userId,
            items,
            totalPrice,
            paymentMethod,
            shippingMethod,
            shippingAddress,
            orderDate: new Date()
        });

        await newOrder.save();
        res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const updateOrder = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid order ID" });
    }
    
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id, 
            updates, 
            { new: true, runValidators: true }
        ).populate('userId', 'username email');
        
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error("Error updating order:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid order ID" });
    }
    
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        
        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        
        res.status(200).json({ success: true, message: "Order successfully deleted" });
    } catch (error) {
        console.error("Error deleting order:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
