const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        // .populate("patient")
        // .populate("doctor");
        // populate ba2eit el 7agat hena aw ta7t
        if (!user)
            return res.status(400).json({ error: "User does not exist" });
        const passwordMatched = await bcrypt.compare(password, user.password);
        if (!passwordMatched) {
            res.status(400).json({ error: "incorrect password" });
        }

        const token = jwt.sign(
            { user_id: user._id },
            process.env.ACCESS_TOKEN_SECRET
        );

        let response = {};
        response.token = token;
        response.user = user;

        if (user.admin) {
            response.user_type = "admin";
        } else if (user.doctor) {
            response.user_type = "doctor";

            const doctor = await Doctor.findById(user.doctor);
            await doctor.populate({
                path: "appointments",
                populate: { path: "patient" },
            });
            response.doctor = doctor;
        } else if (user.patient) {
            response.user_type = "patient";

            const patient = await Patient.findById(user.patient);
            await patient.populate([
                { path: "package" },
                {
                    path: "appointments",
                    populate: { path: "doctor" },
                },
                {
                    path: "prescriptions.associated_appointment",
                    populate: { path: "doctor" },
                },
                {
                    path: "family.patient",
                    populate: [
                        { path: "package" },
                        {
                            path: "appointments",
                            populate: { path: "doctor" },
                        },
                        {
                            path: "prescriptions.associated_appointment",
                            populate: { path: "doctor" },
                        },
                    ],
                },
            ]);
            response.patient = patient;
        }
        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

const changeUserPassword = async (req, res) => {
    try {
    } catch (err) {}
};

const generateOTP = async () => {};

module.exports = { login, changeUserPassword, generateOTP };
