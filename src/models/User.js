const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("User", userSchema);
