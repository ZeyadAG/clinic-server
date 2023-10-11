const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const registerNewPatient = async (req, res) => {
    try {
        const {
            username,
            password,
            name,
            email,
            date_of_birth,
            gender,
            mobile_number,
            emergency_contact,
        } = req.body;

        const patient = new Patient({
            name,
            email,
            date_of_birth,
            gender,
            mobile_number,
            emergency_contact,
        });

        const user = new User({
            username,
            password,
            patient: patient._id,
        });

        // await Promise.all([user.save(), patient.save()]);
        await user.save();
        await patient.save();

        return res.status(201).json(user);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const registerNewDoctor = async (req, res) => {
    try {
        const {
            username,
            password,
            name,
            email,
            date_of_birth,
            hourly_rate,
            affiliated_hospital,
            educational_background,
        } = req.body;

        const doctor = new Doctor({
            name,
            email,
            date_of_birth,
            hourly_rate,
            affiliated_hospital,
            educational_background,
        });
        const user = new User({
            username,
            password,
            doctor: doctor._id,
        });

        await user.save();
        await doctor.save();

        return res.status(201).json(doctor);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports = { registerNewPatient, registerNewDoctor };
