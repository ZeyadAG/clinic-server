const User = require("../models/User");
const Doctor = require("../models/Doctor");

const updateDoctorInfo = async (req, res) => {
    try {
        const { email, hourly_rate, affiliated_hospital } = req.body;
        const doctorID = req.params.id;

        const doctor = await Doctor.findById(doctorID);
        console.log(doctorID);

        if (email) {
            doctor.email = email;
        }
        if (hourly_rate) {
            doctor.hourly_rate = hourly_rate;
        }
        if (affiliated_hospital) {
            doctor.affiliated_hospital = affiliated_hospital;
        }

        await doctor.save();

        return res.status(200).json(doctor);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const getDoctorPatients = async (req, res) => {
    try {
        const doctorID = req.params.id;
        const doctor = await Doctor.findById(doctorID).populate({
            path: "appointments",
            populate: { path: "patient" },
        });

        const patients = doctor.appointments.map((a) => a.patient);

        return res.status(200).json(patients);
    } catch (err) {
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
        const doctor = await Doctor.findById(doctorID)
            .populate({
                path: "appointments",
                populate: { path: "patient" },
            })
            .populate({
                path: "appointments",
                populate: { path: "doctor" },
            });

        const appointments = doctor.appointments;

        return res.status(200).json(appointments);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

module.exports = {
    updateDoctorInfo,
    getDoctorPatients,
    getPatientByName,
    getDoctorAppointments,
};
