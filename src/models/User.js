const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require("dotenv").config();

//const validator = require('validator')
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },

        password: {
            type: String,
            required: true,
            // match: [
            //     /^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
            //     "password must contain at least 8 characters, a number, lowercase and uppercase letters, and a special character",
            // ],
        },

        doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
        patient: { type: Schema.Types.ObjectId, ref: "Patient" },
        admin: { type: Boolean },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    this.unhashed_password = this.password;
    console.log("pass: " + this.unhashed_password, this.password);
    this.password = await bcrypt.hash(this.password, 10);

    next();
});

module.exports = mongoose.model("User", userSchema);
