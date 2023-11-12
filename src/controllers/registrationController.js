const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcrypt");

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

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            // password,
            name, // +
            email, // +
            patient: patient._id,
        });

        patient.user = user._id;

        await user.save();
        await patient.save();

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

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            // password,
            name,
            email,
            doctor: doctor._id,
        });

        doctor.user = user._id;

        const { national_id, medical_degree, licenses } = req.files;
        ``;
        if (!national_id || !medical_degree || !licenses) {
            return res.status(400).send("Not all files were uploaded.");
        }

        const stringID = "" + doctor._id;

        const nationalIDPath = `./user-files/doctors-files/${stringID.slice(
            -7
        )}-${national_id.name}`;

        const medicalDegreePath = `./user-files/doctors-files/${stringID.slice(
            -7
        )}-${medical_degree.name}`;

        await national_id.mv(nationalIDPath, function (err) {
            if (err) return res.status(500).send(err);
        });
        await medical_degree.mv(medicalDegreePath, function (err) {
            if (err) return res.status(500).send(err);
        });

        if (!Array.isArray(licenses)) {
            let licensePath = `./user-files/doctors-files/${stringID.slice(
                -7
            )}-${licenses.name}`;

            await licenses.mv(licensePath, function (err) {
                if (err) return res.status(500).send(err);
            });
            doctor.medical_licenses.push(licensePath);
        } else {
            licenses.forEach(async (license) => {
                let licensePath = `./user-files/doctors-files/${stringID.slice(
                    -7
                )}-${license.name}`;

                await license.mv(licensePath, function (err) {
                    if (err) return res.status(500).send(err);
                });
                doctor.medical_licenses.push(licensePath);
            });
        }

        doctor.medical_degree_document = medicalDegreePath;
        doctor.national_id_document = nationalIDPath;

        await user.save();
        await doctor.save();
        return res.status(201).json(doctor);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

module.exports = { registerNewPatient, registerNewDoctor };
