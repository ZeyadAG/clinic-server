const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicineSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        picture: { type: String },
        medicinal_use: { type: String },
        active_ingredients: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        sales: { type: Number, default: 0 },
        archived: {
            type: String,
            enum: ["Archived", "Not Archived"],
            default: "Not Archived",
        },
        prescribed: {
            type: String,
            enum: ["Prescribed", "Not Prescribed"],
            default: "Not Prescribed",
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Medicine", medicineSchema);
