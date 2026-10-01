const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get Cart
router.get("/:email", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Add to Cart
router.post("/add", async (req, res) => {
    try {
        const { email, name, price, image } = req.body;
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Check if product already in cart
        const existingItemIndex = user.cart.findIndex(item => item.name === name);

        if (existingItemIndex > -1) {
            user.cart[existingItemIndex].quantity += 1;
        } else {
            user.cart.push({ name, price, image, quantity: 1 });
        }

        await user.save();
        res.status(200).json({ success: true, cart: user.cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Update Quantity
router.post("/updateQuantity", async (req, res) => {
    try {
        const { email, name, change } = req.body;
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const existingItemIndex = user.cart.findIndex(item => item.name === name);

        if (existingItemIndex > -1) {
            let newQty = user.cart[existingItemIndex].quantity + change;
            if (newQty > 0) {
                user.cart[existingItemIndex].quantity = newQty;
            } else {
                user.cart.splice(existingItemIndex, 1); // Remove if 0
            }
            await user.save();
        }

        res.status(200).json({ success: true, cart: user.cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Remove/Update Cart item (Optional but good to have)
router.post("/remove", async (req, res) => {
     try {
        const { email, name } = req.body;
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.cart = user.cart.filter(item => item.name !== name);

        await user.save();
        res.status(200).json({ success: true, cart: user.cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Clear Cart (For Checkout)
router.post("/clear", async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.cart = []; // Empty the array

        await user.save();
        res.status(200).json({ success: true, cart: user.cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
