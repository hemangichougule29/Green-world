const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// Create Order (Checkout)
router.post("/checkout", async (req, res) => {
    try {
        const { email, total } = req.body;
        const User = require("../models/User"); // Need User to get cart

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || user.cart.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const newOrder = new Order({
            email: email.toLowerCase(),
            orderId: "ORD" + Date.now(),
            date: new Date().toLocaleString(),
            total,
            products: user.cart
        });

        await newOrder.save();
        
        // Empty the cart
        user.cart = [];
        await user.save();

        res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Get User Orders
router.get("/:email", async (req, res) => {
    try {
        const orders = await Order.find({ email: req.params.email.toLowerCase() }).sort({ _id: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
