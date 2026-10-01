const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();


// ===============================
// REGISTER API
// ===============================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;


        // Check all fields
        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }


        // Check existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Account already exists. Please login."
            });

        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const newUser = new User({

            name: name,

            email: email.toLowerCase(),

            password: hashedPassword

        });


        // Save user in MongoDB
        await newUser.save();


        // Success response
        res.status(201).json({

            success: true,

            message: "Account created successfully!",

            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

});

// ===============================
// LOGIN API
// ===============================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Success response
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;