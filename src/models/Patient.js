const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
    {
        // name: { type: String, required: true },

        // email: { type: String, required: true, lowercase: true },

        user: { type: Schema.Types.ObjectId, ref: "User" },

        date_of_birth: { type: Date, required: true },

        gender: { type: String, enum: ["male", "female"], required: true },

        mobile_number: { type: String, required: true },

        national_id: { type: String, required: true },

        emergency_contact: {
            name: { type: String, required: true },
            mobile_number: { type: String, required: true },
        },

        package: {
            package_info: { type: Schema.Types.ObjectId, ref: "Package" },
            purchase_date: Date,
            expiry_date: Date,
            status: {
                type: String,
                enum: ["subscribed", "unsubscribed", "expired"],
                required: true,
                default: "unsubscribed",
            },
        },

        wallet_amount: { type: Number, default: 0 },

        appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],

        prescriptions: [
            {
                medicines: [{ name: String, dosage: String }],
                associated_appointment: {
                    type: Schema.Types.ObjectId,
                    ref: "Appointment",
                },
                time_of_prescription: { type: Date },
                status: {
                    type: String,
                    enum: ["filled", "unfilled"],
                },
            },
        ],

        family: [
            {
                patient: { type: Schema.Types.ObjectId, ref: "Patient" },
                relation: {
                    type: String,
                    enum: ["husband", "wife", "child", "parent", "sibling"],
                    required: true,
                },
                linked_account: {
                    link_type: {
                        type: String,
                        enum: ["email", "mobile_number"],
                    },
                    link: { type: String },
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
