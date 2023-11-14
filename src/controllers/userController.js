const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Package = require("../models/Package");

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user)
            return res.status(400).json({ error: "User does not exist" });

        const passwordMatched = await bcrypt.compare(password, user.password);
        if (!passwordMatched) {
            return res.status(400).json({ error: "incorrect password" });
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
                { path: "package.package_info" },
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
                        { path: "user" },
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
                {
                    path: "health_records.doctor",
                    populate: { path: "user" },
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
        const { password } = req.body;
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const generateOTP = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        const otp = Math.floor(100000 + Math.random() * 900000) + "";

        // Send the OTP to the user's email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "seifkandel3@gmail.com",
                pass: "c x o d r z b m d n u s y f p r",
            },
        });

        const mailOptions = {
            from: "seifkandel3@gmail.com",
            to: user.email,
            subject: "Olayan Password Reset OTP",
            text: `Your OTP is: ${otp}`,
        };

        transporter.sendMail(mailOptions);

        return res.json({ otp, user_id: user._id });
    } catch (error) {
        return res.status(500).json({ error: err.message });
    }
};

const uploadFile = async (req, res) => {
    try {
        const { path } = req.body;
        return res.status(200).download(path);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        return res.status(200).json(packages);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports = {
    login,
    changeUserPassword,
    generateOTP,
    uploadFile,
    getAllPackages,
};
