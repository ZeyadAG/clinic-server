const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        email: { type: String, lowercase: true },
        date_of_birth: { type: Date, required: true },
        gender: { type: String, enum: ["male", "female"], required: true },
        mobile_number: { type: String, required: true },
        national_id: { type: String, required: true },
        addresses: [{ address: { type: String, required: true } }],
        emergency_contact: {
            name: { type: String, required: true },
            mobile_number: { type: String, required: true },
        },

        wallet_amount: { type: Number, default: 0 },

        medical_history_documents: [{ type: String }],

        health_records: [
            {
                doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
                title: String,
                description: String,
                time_stamp: Date,
            },
        ],

        package: {
            package_info: { type: Schema.Types.ObjectId, ref: "Package" },
            purchase_date: Date,
            expiry_date: Date,
            status: {
                type: String,
                enum: ["subscribed", "unsubscribed"],
                required: true,
                default: "unsubscribed",
            },
        },

        family: [
            {
                patient: { type: Schema.Types.ObjectId, ref: "Patient" },
                relation: {
                    type: String,
                    enum: ["husband", "wife", "child", "parent", "sibling"],
                    required: true,
                },
            },
        ],

        appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],

        follow_up_requests: [
            { type: Schema.Types.ObjectId, ref: "Appointment" },
        ],

        prescriptions: [
            {
                medicines: [
                    {
                        medicine: {
                            type: Schema.Types.ObjectId,
                            ref: "Medicine",
                        },
                        dosage: String,
                    },
                ],
                associated_doctor: {
                    type: Schema.Types.ObjectId,
                    ref: "Doctor",
                },
                status: {
                    type: String,
                    enum: ["filled", "unfilled"],
                },
                date_of_prescription: Date,
            },
        ],

        cart: [
            {
                medicineId: { type: Schema.Types.ObjectId, ref: "Medicine" },
                name: { type: String },
                price: { type: Number },
                quantity: { type: Number, required: true },
                prescription_ids: [Schema.Types.ObjectId],
            },
        ],

        orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
