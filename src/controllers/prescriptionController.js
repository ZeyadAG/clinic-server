const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Medicine = require("../models/Medicine");

const { Types } = require("mongoose");

const getPatientPrescriptions = async (req, res) => {
    try {
        const { patientID } = req.params;
        const patient = await Patient.findById(patientID).populate([
            { path: "prescriptions.medicines.medicine" },
            {
                path: "prescriptions.associated_doctor",
                populate: "user",
            },
        ]);

        return res.status(200).json(patient.prescriptions);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getDoctorPrescriptions = async (req, res) => {
    try {
        const { doctorID } = req.params;
        const patient = await Patient.findById(patientID).populate({
            path: "prescriptions.associated_doctor",
            populate: "user",
        });

        const doctor = await Doctor.findById(doctorID).populate({
            path: "appointments",
            populate: { path: "patient", populate: { path: "user" } },
        });

        const prescriptions = patient.prescriptions;

        return res.status(200).json(prescriptions);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find();

        return res.status(200).json(medicines);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const addNewPrescription = async (req, res) => {
    try {
        const { patientID, doctorID } = req.params;
        const { medicines } = req.body;

        const patient = await Patient.findById(patientID);

        const prescription = {
            medicines,
            associated_doctor: new Types.ObjectId(doctorID),
            date_of_prescription: new Date(),
            status: "unfilled",
        };

        patient.prescriptions.push(prescription);

        await patient.save();

        return res.status(200).json(patient.prescriptions);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
};

const editPrescription = async (req, res) => {
    try {
        const { patientID, prescriptionID } = req.params;
        const { medicines } = req.body;

        const patient = await Patient.findById(patientID);

        const prescriptionIndex = patient.prescriptions.findIndex(
            (prescription) => prescription._id == prescriptionID
        );

        patient.prescriptions[prescriptionIndex].medicines = medicines;

        await patient.save();

        return res.status(200).json(patient.prescriptions);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
};

const buyPrescriptionFromPharmacy = async (req, res) => {
    try {
        const { patientID, prescriptionID } = req.params;

        const patient = await Patient.findById(patientID);

        console.log(
            "🚀 ~ file: prescriptionController.js:110 ~ buyPrescriptionFromPharmacy ~ patient BEFORE:",
            patient.cart
        );

        const prescriptionIndex = patient.prescriptions.findIndex(
            (prescription) => prescription._id == prescriptionID
        );

        const medicineIDs = patient.prescriptions[
            prescriptionIndex
        ].medicines.map((med) => med.medicine);

        console.log(
            "🚀 ~ file: prescriptionController.js:116 ~ buyPrescriptionFromPharmacy ~ medicineIDs:",
            medicineIDs
        );

        const medicines = await Medicine.find({ _id: { $in: medicineIDs } });

        console.log(
            "🚀 ~ file: prescriptionController.js:118 ~ buyPrescriptionFromPharmacy ~ medicines:",
            medicines
        );

        // TODO
        medicines.forEach((med) => {
            const cartItem = patient.cart.find(
                (item) => item.medicineId.toString() === med._id.toString()
            );
            console.log(
                "🚀 ~ file: prescriptionController.js:125 ~ medicines.forEach ~ cartItem:",
                cartItem
            );

            if (cartItem) {
                if (med.quantity > 0) {
                    cartItem.quantity++;
                    med.quantity--;
                }
                cartItem.prescription_ids.push(prescriptionID);
            } else {
                const newCartItem = {
                    medicineId: med._id,
                    name: med.name,
                    price: med.price,
                    quantity: 1,
                    prescription_ids: [prescriptionID],
                };
                console.log(
                    "🚀 ~ file: prescriptionController.js:141 ~ medicines.forEach ~ newCartItem:",
                    newCartItem
                );

                // patient.cart = [...patient.cart, newCartItem];
                patient.cart.push(newCartItem);
                console.log(
                    "🚀 ~ file: prescriptionController.js:144 ~ medicines.forEach ~ cart:",
                    patient.cart
                );
            }
        });

        await patient.save();

        console.log(
            "🚀 ~ file: prescriptionController.js:169 ~ buyPrescriptionFromPharmacy ~ patient AFTER:",
            patient.cart
        );
        return res.status(200).json(patient);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
};

const addToCart = async (req, res) => {
    const { id } = req.params;
    const { medicineId } = req.body;

    try {
        const patient = await Patient.findById(id);
        const medicine = await Medicine.findById(medicineId);

        if (!patient) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!medicine) {
            return res.status(404).json({ error: "Medicine not found" });
        }

        if (medicine.quantity === 0) {
            return res.status(404).json({ error: "Medicine Out of Stock" });
        }

        const CART = patient.cart || []; // Ensure CART is initialized

        // Check if the medicine is already in the cart
        const existingItem = CART.find(
            (item) => item.medicineId.toString() === medicineId.toString()
        );

        if (existingItem) {
            if (medicine.quantity === existingItem.quantity) {
                return res
                    .status(404)
                    .json({ error: "No More Medicine to Add" });
            }
            // If the medicine is already in the cart, increment  quantity
            existingItem.quantity++;

            // Update the patient's cart in the database
            patient.cart = CART;
            await patient.save();

            return res.status(200).json({ cart: patient.cart });
        } else {
            // If the medicine is not in the cart, then 1
            const newItem = {
                medicineId,
                name: medicine.name,
                price: medicine.price,
                quantity: 1,
            };
            const updatedCart = [...CART, newItem];

            // Update the patient's cart in the database
            patient.cart = updatedCart;
            await patient.save();

            return res.status(200).json({ cart: patient.cart });
        }
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

module.exports = {
    getPatientPrescriptions,
    getDoctorPrescriptions,
    getAllMedicines,
    addNewPrescription,
    editPrescription,
    buyPrescriptionFromPharmacy,
};
