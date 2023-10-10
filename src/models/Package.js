const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        price: { type: Number, required: true },

        doctor_sessions_discount: { type: Number, required: true },

        medicin_discount: { type: Number, required: true },

        subscription_discount: { type: Number, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
