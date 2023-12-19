const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        cart: [
            {
                medicineId: { type: Schema.Types.ObjectId, ref: "Medicine" },
                name: { type: String },
                price: { type: Number },
                quantity: { type: Number, required: true },
            },
        ],
        status: {
            type: String,
            enum: ["pending", "confirmed", "delivered", "canceled"],
            default: "pending",
        },
        total: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "credit"],
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        orderDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
