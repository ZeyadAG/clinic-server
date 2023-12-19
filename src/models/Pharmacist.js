const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pharmacistSchema = new Schema(
    {
        registration_request_status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },

        name: { type: String, required: true },

        email: { type: String, required: true, lowercase: true },

        date_of_birth: { type: Date, required: true },

        hourly_rate: { type: Number, required: true },

        national_id_document: String,
        pharmacy_degree_document: String,
        licenses: [String],

        affiliated_hospital: { type: String, required: true },

        educational_background: { type: String, required: true },

        wallet_amount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Pharmacist", pharmacistSchema);
