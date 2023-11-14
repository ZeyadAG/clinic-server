const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },

        registration_status: {
            type: String,
            enum: ["pending", "accepted_by_admin", "accepted"],
            default: "pending",
        },

        national_id_document: String,
        medical_degree_document: String,
        medical_licenses: [String],

        date_of_birth: { type: Date, required: true },

        affiliated_hospital: { type: String, required: true },

        educational_background: { type: String, required: true },

        speciality: { type: String, required: true },

        hourly_rate: { type: Number, required: true },

        wallet_amount: { type: Number, default: 0 },

        appointments_time_slots: [
            {
                start_time: {
                    type: Date,
                    required: true,
                },
                end_time: {
                    type: Date,
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["reserved", "available"],
                    default: "available",
                },
                price: { type: Number },
            },
        ],

        appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
