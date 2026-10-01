const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get Wishlist
router.get("/:email", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        res.status(200).json({ success: true, wishlist: user.wishlist || [] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Add to Wishlist
router.post("/add", async (req, res) => {
    try {
        const { email, name, price, image } = req.body;
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Ensure wishlist array exists
        if (!user.wishlist) user.wishlist = [];

        // Check if product already in wishlist
        const existingItemIndex = user.wishlist.findIndex(item => item.name === name);

        if (existingItemIndex === -1) {
            user.wishlist.push({ name, price, image });
            await user.save();
        }

        res.status(200).json({ success: true, wishlist: user.wishlist });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Remove from Wishlist
router.post("/remove", async (req, res) => {
     try {
        const { email, name } = req.body;
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (user.wishlist) {
            user.wishlist = user.wishlist.filter(item => item.name !== name);
            await user.save();
        }
        
        res.status(200).json({ success: true, wishlist: user.wishlist || [] });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
