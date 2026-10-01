const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    orderId: { type: String, required: true },
    date: { type: String, required: true },
    total: { type: String, required: true },
    products: [{
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }]
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
