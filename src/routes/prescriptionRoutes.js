const express = require("express");
const prescriptionController = require("../controllers/prescriptionController");

const router = express.Router();

router.get(
    "/patient/:patientID",
    prescriptionController.getPatientPrescriptions
);

// momken mane7taghash
router.get("/doctor/:doctorID", prescriptionController.getDoctorPrescriptions);

router.get("/availableMedicines", prescriptionController.getAllMedicines);

router.post(
    "/newPrescription/:patientID/:doctorID",
    prescriptionController.addNewPrescription
);

router.post(
    "/:prescriptionID/editPrescription/:patientID/",
    prescriptionController.editPrescription
);

router.post(
    "/:prescriptionID/buyPrescriptionFromPharmacy/:patientID",
    prescriptionController.buyPrescriptionFromPharmacy
);

module.exports = router;
