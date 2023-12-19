const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },

        name: { type: String, required: true },
        email: { type: String, required: true, lowercase: true },

        admin: { type: Boolean },
        doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
        patient: { type: Schema.Types.ObjectId, ref: "Patient" },
        pharmacist: { type: Schema.Types.ObjectId, ref: "Pharmacist" },

        notifications: [
            {
                type: {
                    type: String,
                    enum: [
                        "new appointment",
                        "cancelled appointment",
                        "rescheduled appointment",
                        "medicine out of stock",
                    ],
                },
                description: String,
                time_of_notification: Date,
                appointment: {
                    type: Schema.Types.ObjectId,
                    ref: "Appointment",
                },
                medicine: { type: Schema.Types.ObjectId, ref: "Medicine" },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
