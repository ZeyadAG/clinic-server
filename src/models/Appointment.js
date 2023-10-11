const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
    {
        doctor: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },

        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        time_slot: {
            start_time: {
                type: Date,
                required: true,
            },
            end_time: {
                type: Date,
                required: true,
            },
        },

        status: {
            type: String,
            enum: ["upcoming", "completed", "cancelled", "rescheduled"],
            default: "upcoming",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
