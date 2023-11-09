const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
    {
        name: { type: String, required: true },

        email: { type: String, required: true, lowercase: true },

        date_of_birth: { type: Date, required: true },

        gender: { type: String, enum: ["male", "female"], required: true },

        mobile_number: { type: String, required: true },

        emergency_contact: {
            name: { type: String, required: true },
            mobile_number: { type: String, required: true },
        },

        // national_id: {
        //     type: String,
        // },

        package: {
            type: Schema.Types.ObjectId,
            ref: "Package",
            default: null,
            // default: Schema.Types.ObjectId("") // refers to the "none" package
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

        family: {
            members: [
                {
                    name: { type: String, required: true },
                    national_id: { type: String, required: true },
                    age: { type: Number, required: true },
                    gender: {
                        type: String,
                        enum: ["male", "female"],
                        required: true,
                    },
                    relation: {
                        type: String,
                        enum: ["husband", "wife", "child"],
                        required: true,
                    },

                    appointments: [
                        { type: Schema.Types.ObjectId, ref: "Appointment" },
                    ],
                    prescriptions: [
                        {
                            medicines: [{ name: String, dosage: String }],
                            associated_appointment: {
                                type: Schema.Types.ObjectId,
                                ref: "Appointment",
                            },
                            status: {
                                type: String,
                                enum: ["filled", "unfilled"],
                            },
                        },
                    ],

                    linked_account: {
                        link_type: { type: String },
                        link: { type: String },
                    },
                },
            ],
            highest_package: {
                type: String,
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
