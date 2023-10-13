const User = require("../models/User");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

const { Types } = require("mongoose");

const addFamilyMember = async (req, res) => {
    try {
        const patientID = req.params.id;
        const { name, national_id, age, gender, relation } = req.body;

        const patient = await Patient.findById(patientID);

        const newMember = { name, national_id, age, gender, relation };

        patient.family.members.push(newMember);

        await patient.save();

        return res.status(200).json(patient.family);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getFamilyMembers = async (req, res) => {
    try {
        const patientID = req.params.id;
        const patient = await Patient.findById(patientID);

        const familyMembers = patient.family.members;

        return res.status(200).json(familyMembers);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const addNewAppointment = async (req, res) => {
    try {
        const appointment = new Appointment({
            doctor: new Types.ObjectId("6526a07ae28d3bb9af22f111"),
            patient: new Types.ObjectId("6526a043e28d3bb9af22f103"),
            time_slot: {
                start_time: new Date("2023-10-11T15:17:46.484+00:00"),
                end_time: new Date("2023-10-11T16:17:46.484+00:00"),
            },
        });

        const doctor = await Doctor.findById("6526a07ae28d3bb9af22f111");
        const patient = await Patient.findById("6526a043e28d3bb9af22f103");

        doctor.appointments.push(appointment._id);
        patient.appointments.push(appointment._id);

        await appointment.save();
        await patient.save();
        await doctor.save();

        return res.status(200).json(appointment);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getPatientAppointments = async (req, res) => {
    try {
        const patientID = req.params.id;
        const patient = await Patient.findById(patientID)
            .populate({
                path: "appointments",
                populate: { path: "patient" },
            })
            .populate({
                path: "appointments",
                populate: { path: "doctor" },
            });

        const appointments = patient.appointments;

        return res.status(200).json(appointments);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getPatientDoctors = async (req, res) => {
    try {
        const patientID = req.params.id;
        const patient = await Patient.findById(patientID).populate({
            path: "appointments",
            populate: { path: "doctor" },
        });

        const doctors = patient.appointments.map((a) => a.doctor);

        return res.status(200).json(doctors);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const addNewPrescription = async (req, res) => {
    try {
        const patient = await Patient.findById("6526a043e28d3bb9af22f103");
        const prescription = {
            medicines: [
                {
                    name: "congestal",
                    dosage: "100mg",
                },
                {
                    name: "panadol",
                    dosage: "500mg",
                },
            ],
            associated_appointment: new Types.ObjectId(
                "6527ad529c398daf81c877eb"
            ),
            time_of_prescription: new Date("2023-10-11T18:17:46.484+00:00"),
            status: "filled",
        };

        patient.prescriptions.push(prescription);

        await patient.save();

        return res.status(200).json(patient);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getPatientPrescriptions = async (req, res) => {
    try {
        const patientID = req.params.id;
        const patient = await Patient.findById(patientID)
            .populate({
                path: "prescriptions.associated_appointment",
                populate: { path: "patient" },
            })
            .populate({
                path: "prescriptions.associated_appointment",
                populate: { path: "doctor" },
            });

        const prescriptions = patient.prescriptions;

        return res.status(200).json(prescriptions);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

module.exports = {
    addFamilyMember,
    getFamilyMembers,
    addNewAppointment,
    getPatientAppointments,
    getPatientDoctors,
    addNewPrescription,
    getPatientPrescriptions,
};
