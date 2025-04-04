import mongoose from "mongoose";

const orderItemSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    productType: {
        type: String,
        enum: ['product', 'ticket'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    items: [orderItemSchema],
    totalPrice: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending' 
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    paymentMethod: { 
        type: String, 
        enum: ['creditCard','cash'], 
        required: true 
    },
    shippingMethod: { 
        type: String, 
        enum: ['standard', 'express'], 
        required: true 
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        phone: { type: String, required: true },
        country: { type: String, required: true }
    }
}, 
{
    timestamps: true
});


const Order = mongoose.model("Order", orderSchema);

export default Order;