const express = require("express");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", login);

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
            .populate("patient")
            .populate("doctor");

        const passwordMatched = await bcrypt.compare(password, user.password);
        if (!passwordMatched) {
            res.status(400).json({ error: "incorrect password" });
        }

        const token = jwt.sign(
            { user_id: user._id },
            process.env.ACCESS_TOKEN_SECRET
        );

        let response = {};
        if (user.doctor) {
            response.user_type = "admin";
        }
        if (user.patient) {
            response.user_type = "patient";
        }
        if (user.admin) {
            response.user_type = "doctor";
        }

        response.token = token;
        response.user = user;

        return res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = router;
