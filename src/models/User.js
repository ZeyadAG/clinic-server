const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },

        name: { type: String, required: true },
        email: { type: String, required: true, lowercase: true },

        doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
        patient: { type: Schema.Types.ObjectId, ref: "Patient" },
        admin: { type: Boolean },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
