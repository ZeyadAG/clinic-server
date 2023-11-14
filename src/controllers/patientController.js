const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Package = require("../models/Package");

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

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

        return res.status(200).json(familyMember);
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
                { path: "package.package_info" },
                {
                    path: "appointments",
                    populate: { path: "doctor", populate: "user" },
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

const handleWalletPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_amount } = req.body;

        const patient = await Patient.findById(id);

        patient.wallet_amount -= payment_amount;

        await patient.save();
        return res.status(200).json(patient.wallet_amount);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const handlePackageCardPayment = async (req, res) => {
    try {
        const { payment_name, payment_amount } = req.body;
        const { patient_id, package_id } = req.body;

        //Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: payment_name,
                        },
                        unit_amount: payment_amount * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: `http://localhost:5173/packageSuccessPayment/${patient_id}/${package_id}`,
            cancel_url: `http://localhost:5173/cancel`,
        });
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const handleAppointmentCardPayment = async (req, res) => {
    try {
        const { payment_name, payment_amount } = req.body;
        const { patient_id, doctor_id, timeslot_id } = req.body;

        //Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: payment_name,
                        },
                        unit_amount: payment_amount * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: `http://localhost:5173/appointmentSuccessPayment/${patient_id}/${doctor_id}/${timeslot_id}`,
            cancel_url: `http://localhost:5173/cancel`,
        });
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const addNewAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorID = req.body.doctor_id;
        const timeslotID = req.body.time_slot;

        const [patient, doctor] = await Promise.all([
            Patient.findById(id),
            Doctor.findById(doctorID),
        ]);

        const timeslotIndex = doctor.appointments_time_slots.findIndex(
            (slot) => slot._id == timeslotID
        );

        const timeslot = doctor.appointments_time_slots[timeslotIndex];

        if (timeslot.status === "reserved") {
            doctor.appointments_time_slots[timeslotIndex].status = "reserved";
            return res.status(200).json({ message: "already reserved" });
        }

        doctor.appointments_time_slots[timeslotIndex].status = "reserved";

        const appointment = new Appointment({
            doctor: doctorID,
            patient: id,
            time_slot: {
                start_time: timeslot.start_time,
                end_time: timeslot.end_time,
            },
        });

        await appointment.save();

        doctor.appointments.push(appointment._id);
        patient.appointments.push(appointment._id);

        await Promise.all([patient.save(), doctor.save()]);

        return res.status(200).json({ appointment });
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
        const { id, packageID } = req.params;

        const [patient, package] = await Promise.all([
            Patient.findById(id),
            Package.findById(packageID),
        ]);

        patient.package.package_info = package._id;

        const purchaseDate = new Date();
        patient.package.purchase_date = purchaseDate;
        patient.package.expiry_date = new Date().setFullYear(
            purchaseDate.getFullYear() + 1
        );

        patient.package.status = "subscribed";

        await patient.save();
        return res
            .status(200)
            .json({ package: patient.package, package_info: package });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const cancelPackageSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findById(id);

        patient.package.status = "unsubscribed";

        await patient.save();
        return res.status(200).json(patient.package);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getDoctorsBasedOnPackage = async (req, res) => {
    try {
        const { id } = req.params;
        const [patient, doctors] = await Promise.all([
            Patient.findById(id).populate("package.package_info"),
            Doctor.find({
                registration_status: "accepted",
            }).populate("user"),
        ]);

        const discount =
            patient.package.status === "subscribed"
                ? patient.package.package_info.doctor_sessions_discount
                : 0;

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
        const patient = await Patient.findById("654fcc79fe70c5c236e1ef50");
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
                "6551532ae658e1ef7be41886"
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
        const patient = await Patient.findById(patientID).populate({
            path: "prescriptions.associated_appointment",
            populate: { path: "doctor", populate: "user" },
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
    handleWalletPayment,
    handleAppointmentCardPayment,
    handlePackageCardPayment,
    addNewAppointment,
    getPatientAppointments,
    getPatientDoctors,
    addNewPrescription,
    getPatientPrescriptions,
    changePatientPackage,
    cancelPackageSubscription,
    getDoctorsBasedOnPackage,
    addMedicalHistoryDocument,
    getMedicalHistoryDocuments,
};
