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
            national_id, // +
            emergency_contact,
        } = req.body;

        const patient = new Patient({
            // name, // -
            // email, // -
            date_of_birth,
            gender,
            mobile_number,
            national_id, // +
            emergency_contact,
        });

        const user = new User({
            username,
            password,
            name, // +
            email, // +
            patient: patient._id,
        });

        patient.user = user._id;

        await Promise.all([user.save(), patient.save()]);

        return res.status(201).json(patient);
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
            speciality, // +
            date_of_birth,
            hourly_rate,
            affiliated_hospital,
            educational_background,
        } = req.body;

        const doctor = new Doctor({
            // name,
            // email,
            speciality, // +
            date_of_birth,
            hourly_rate,
            affiliated_hospital,
            educational_background,
        });
        const user = new User({
            username,
            password,
            name,
            email,
            doctor: doctor._id,
        });

        doctor.user = user._id;

        await Promise.all([user.save(), doctor.save()]);

        return res.status(201).json(doctor);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports = { registerNewPatient, registerNewDoctor };
