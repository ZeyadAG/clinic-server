const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const updateDoctorInfo = async (req, res) => {
    try {
        const { email, hourly_rate, affiliated_hospital } = req.body;
        const doctorID = req.params.id;

        const doctor = await Doctor.findById(doctorID);

        if (email) {
            const user = await User.findOne({ doctor: doctorID });
            user.email = email;
            await user.save();
        }
        if (hourly_rate) {
            doctor.hourly_rate = hourly_rate;
        }
        if (affiliated_hospital) {
            doctor.affiliated_hospital = affiliated_hospital;
        }

        await doctor.save();

        return res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getDoctorPatients = async (req, res) => {
    try {
        const doctorID = req.params.id;
        const doctor = await Doctor.findById(doctorID).populate({
            path: "appointments",
            populate: { path: "patient", populate: { path: "user" } },
        });

        const patients = doctor.appointments.map((a) => a.patient);

        return res.status(200).json(patients);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
};

const getPatientByName = async (req, res) => {
    try {
        const doctorID = req.params.id;
        const patientName = req.params.patientName;

        const doctor = await Doctor.findById(doctorID).populate({
            path: "appointments",
            populate: { path: "patient" },
        });

        const patient = doctor.appointments
            .map((a) => a.patient)
            .filter((patient) => patient.name === patientName);

        return res.status(200).json(patient);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getDoctorAppointments = async (req, res) => {
    try {
        const doctorID = req.params.id;
        const doctor = await Doctor.findById(doctorID).populate({
            path: "appointments",
            populate: { path: "patient", populate: { path: "user" } },
        });

        const appointments = doctor.appointments;

        return res.status(200).json(appointments);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const addHealthRecordForPatient = async (req, res) => {
    try {
        const { id, patientID } = req.params;

        const patient = await Patient.findById(patientID);

        patient.health_records.push({
            doctor: id,
            ...req.body,
        });

        await patient.save();

        return res.status(200).json(patient.health_records);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
};

const acceptEmploymentContract = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);

        doctor.registration_status = "accepted";

        await doctor.save();
        return res.status(200).json(doctor.registration_status);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
};

module.exports = {
    updateDoctorInfo,
    getDoctorPatients,
    getPatientByName,
    getDoctorAppointments,
    addHealthRecordForPatient,
    acceptEmploymentContract,
};
