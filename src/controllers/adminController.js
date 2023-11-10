const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Package = require("../models/Package");

const addNewAdmin = async (req, res) => {
    try {
        const { username, password, name, email } = req.body;
        const admin = new User({
            username,
            password,
            name, // +
            email, // +
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
        let results = {
            admins: [],
            all_patients: [],
            accepted_doctors: [],
            pending_doctors: [],
        };

        results.admins = await User.find({ admin: true });

        results.all_patients = await User.where("patient")
            .ne(null)
            .populate("patient");

        results.accepted_doctors = (
            await User.where("doctor").ne(null).populate("doctor")
        ).filter(
            (user) => user.doctor.registration_request_status === "accepted"
        );
        results.pending_doctors = (
            await User.where("doctor").ne(null).populate("doctor")
        ).filter(
            (user) => user.doctor.registration_request_status === "pending"
        );

        return res.status(200).json(results);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const acceptDoctor = async (req, res) => {
    try {
        const doctorID = req.params.id;
        const doctor = await Doctor.findById(doctorID);

        doctor.registration_request_status = "accepted";

        await doctor.save();
        return res.status(200).json(doctor);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userID = req.params.userID;
        const user = await User.findById(userID);

        if (user.doctor) {
            await Doctor.deleteOne({ _id: user.doctor });
        }
        if (user.patient) {
            await Patient.deleteOne({ _id: user.patient });
        }

        await User.findByIdAndDelete(userID);

        return res.status(200).json({ message: "user deleted successfully" });
    } catch (e) {
        res.status(400).json({ error: e.message });
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

        const packageID = req.params.id;

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
        const packageID = req.params.id;
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
    getAllPackages,
    addNewPackage,
    updatePackage,
    removePackage,
};
