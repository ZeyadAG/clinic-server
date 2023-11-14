const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Package = require("../models/Package");
const Appointment = require("../models/Appointment");

const bcrypt = require("bcrypt");

const addNewAdmin = async (req, res) => {
    try {
        const { username, password, name, email } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new User({
            username,
            password: hashedPassword,
            name,
            email,
            admin: true,
        });

        await admin.save();
        return res.status(201).json(admin);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

const getDataForAdmin = async (req, res) => {
    try {
        const [all_patients, accepted_doctors, pending_doctors, admins] =
            await Promise.all([
                Patient.find().populate("user"),
                Doctor.find({ registration_status: "accepted" }).populate(
                    "user"
                ),
                Doctor.find({ registration_status: "pending" }).populate(
                    "user"
                ),
                User.find({ admin: true }),
            ]);

        return res
            .status(200)
            .json({ all_patients, accepted_doctors, pending_doctors, admins });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const acceptDoctor = async (req, res) => {
    try {
        const doctorID = req.params.id;
        const doctor = await Doctor.findById(doctorID);

        doctor.registration_status = "accepted_by_admin";

        await doctor.save();
        return res.status(200).json(doctor.registration_status);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userID } = req.params;
        const user = await User.findById(userID);

        if (user.doctor) {
            await Promise.all([
                Doctor.findByIdAndDelete(user.doctor),
                Appointment.deleteMany({ doctor: user.doctor }),
            ]);
        }
        if (user.patient) {
            await Promise.all([
                Patient.findByIdAndDelete(user.patient),
                Appointment.deleteMany({ patient: user.patient }),
            ]);
        }

        await User.findByIdAndDelete(userID);

        return res.status(200).json({ message: "user deleted successfully" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const addNewPackage = async (req, res) => {
    try {
        const {
            name,
            price,
            doctor_sessions_discount,
            medicine_discount,
            subscriptions_discount,
        } = req.body;

        const pack = new Package({
            name,
            price,
            doctor_sessions_discount,
            medicine_discount,
            subscriptions_discount,
        });

        await pack.save();
        return res.status(201).json(pack);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};
const updatePackage = async (req, res) => {
    try {
        const {
            name,
            price,
            doctor_sessions_discount,
            medicine_discount,
            subscriptions_discount,
        } = req.body;

        const { packageID } = req.params;

        const pack = await Package.findById(packageID);

        if (name) {
            pack.name = name;
        }
        if (price) {
            pack.price = price;
        }
        if (doctor_sessions_discount) {
            pack.doctor_sessions_discount = doctor_sessions_discount;
        }
        if (medicine_discount) {
            pack.medicine_discount = medicine_discount;
        }
        if (subscriptions_discount) {
            pack.subscriptions_discount = subscriptions_discount;
        }

        await pack.save();

        return res.status(200).json(pack);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const removePackage = async (req, res) => {
    try {
        const { packageID } = req.params;
        await Package.findByIdAndDelete(packageID);
        return res
            .status(200)
            .json({ message: "package deleted successfully" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports = {
    addNewAdmin,
    getDataForAdmin,
    deleteUser,
    acceptDoctor,
    addNewPackage,
    updatePackage,
    removePackage,
};
