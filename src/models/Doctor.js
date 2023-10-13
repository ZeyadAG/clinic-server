const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
    {
        registration_request_status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },

        name: { type: String, required: true },

        speciality: { type: String },

        email: { type: String, required: true, lowercase: true },

        date_of_birth: { type: Date, required: true },

        affiliated_hospital: { type: String, required: true },

        educational_background: { type: String, required: true },

        hourly_rate: { type: Number, required: true },

        appointment_slots: [
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
            },
        ],

        appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
