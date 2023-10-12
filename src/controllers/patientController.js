const User = require("../models/User");
const Patient = require("../models/Patient");

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

const addNewAppointment = async (req, res) => {};

const getPatientAppointments = async (req, res) => {};

const getPatientDoctors = async (req, res) => {};

const addNewPrescription = async (req, res) => {};

const getPatientPrescriptions = async (req, res) => {};

module.exports = {
    addFamilyMember,
    getFamilyMembers,
    addNewAppointment,
    getPatientAppointments,
    getPatientDoctors,
    addNewPrescription,
    getPatientPrescriptions,
};
