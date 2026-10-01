const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    cart: [{
        name: String,
        price: Number,
        image: String,
        quantity: { type: Number, default: 1 }
    }],

    wishlist: [{
        name: String,
        price: Number,
        image: String
    }]

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;