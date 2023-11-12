const User = require("../models/User");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Package = require("../models/Package");
// const path = require('path')

const { Types } = require("mongoose");

const addMedicalHistoryDocument = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send("No files were uploaded.");
        }

        let uploadedFile = req.files.file;
        const filePath = `./user-files/patients-files/${id.slice(-7)}-${
            uploadedFile.name
        }`;

        await uploadedFile.mv(filePath, function (err) {
            if (err) return res.status(500).send(err);

            res.send("File uploaded!");
        });

        const patient = await Patient.findById(id);
        patient.medical_history_documents.push(filePath);

        await patient.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};

const getMedicalHistoryDocuments = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id);
        const medicalHistoryDocuments = patient.medical_history_documents;

        return res.status(200).json(medicalHistoryDocuments);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const addFamilyMember = async (req, res) => {
    try {
        const { id, patientID } = req.params;
        const { relation } = req.body;

        const [patient, familyMember] = await Promise.all([
            Patient.findById(id),
            Patient.findById(patientID),
        ]);

        let otherRelation;
        if (relation === "husband") otherRelation = "wife";
        if (relation === "wife") otherRelation = "husband";
        if (relation === "child") otherRelation = "parent";
        if (relation === "parent") otherRelation = "child";
        if (relation === "sibling") otherRelation = "sibling";

        patient.family.push({ patient: patientID, relation: relation });
        familyMember.family.push({ patient: id, relation: otherRelation });

        await Promise.all([patient.save(), familyMember.save()]);

        return res.status(200).json(patient.family);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getFamilyMembers = async (req, res) => {
    try {
        const patientID = req.params.id;
        const patient = await Patient.findById(patientID).populate({
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
        });

        const familyMembers = patient.family;

        return res.status(200).json(familyMembers);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const addNewAppointment = async (req, res) => {
    try {
        const appointment = new Appointment({
            doctor: new Types.ObjectId("654ebbb91eae82683c4bbbfe"),
            patient: new Types.ObjectId("654e845ec20bc54b4b690f7f"),
            time_slot: {
                start_time: new Date("2023-10-17T15:17:46.484+00:00"),
                end_time: new Date("2023-10-17T16:17:46.484+00:00"),
            },
        });

        const doctor = await Doctor.findById("654ebbb91eae82683c4bbbfe");
        const patient = await Patient.findById("654e845ec20bc54b4b690f7f");

        doctor.appointments.push(appointment._id);
        patient.appointments.push(appointment._id);

        await Promise.all([appointment.save(), patient.save(), doctor.save()]);

        return res.status(200).json(appointment);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getPatientAppointments = async (req, res) => {
    try {
        const patientID = req.params.id;
        const patient = await Patient.findById(patientID).populate({
            path: "appointments",
            populate: { path: "doctor", populate: { path: "user" } },
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

const changePatientPackage = async (req, res) => {
    try {
        const patientID = req.params.id;
        const packageName = req.body.package_name;

        const patient = await Patient.findById(patientID);
        const package = await Package.findOne({ name: packageName });

        console.log(package, package._id);

        patient.package = package._id;

        await patient.save();
        return res.status(200).json(patient.package);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getDoctorsBasedOnPackage = async (req, res) => {
    try {
        const patientID = req.params.id;
        const patient = await Patient.findById(patientID).populate("package");

        const doctors = await Doctor.find({
            registration_status: "accepted",
        });

        const discount = patient.package.doctor_sessions_discount;
        const clinicMarkup = 0.1;

        doctors.forEach((doc) => {
            doc.hourly_rate = (
                doc.hourly_rate +
                doc.hourly_rate * clinicMarkup -
                doc.hourly_rate * discount
            ).toFixed(2);
        });

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
                    name: "milga",
                    dosage: "300mg",
                },
                {
                    name: "congestal",
                    dosage: "1000mg",
                },
            ],
            associated_appointment: new Types.ObjectId(
                "6529f7422ca92c0deda5bd52"
            ),
            time_of_prescription: new Date("2023-10-15T18:17:46.484+00:00"),
            status: "unfilled",
        };

        patient.prescriptions.push(prescription);

        await patient.save();

        return res.status(200).json(patient.prescriptions);
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
    changePatientPackage,
    getDoctorsBasedOnPackage,
    addMedicalHistoryDocument,
    getMedicalHistoryDocuments,
};
