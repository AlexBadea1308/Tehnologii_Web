import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const createProduct = async (req, res) => {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !description || !price || !category) {
        return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    try {
        const newProduct = new Product({ name, description, price, category, image, stock });
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid product ID" });
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error finding product:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid product ID" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid product ID" });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product successfully deleted" });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const updateProductStock = async (req, res) => {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide an array of product updates" 
        });
    }

    try {
        const updatedProducts = [];
        
        for (const update of updates) {
            const { productId, quantity } = update;

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Invalid product ID: ${productId}` 
                });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    message: `Product not found: ${productId}` 
                });
            }

            if (product.stock < quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Insufficient stock for product: ${product.name}` 
                });
            }

            product.stock -= quantity;
            await product.save();
            updatedProducts.push(product);
        }

        res.status(200).json({ 
            success: true, 
            data: updatedProducts,
            message: `${updatedProducts.length} products stock updated`
        });
    } catch (error) {
        console.error("Error updating product stock:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Server error while updating product stock" 
        });
    }
};