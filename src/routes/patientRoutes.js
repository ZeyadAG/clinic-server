const express = require("express");
const patientController = require("../controllers/patientController");
const fileUpload = require("express-fileupload");

const router = express.Router();

// router.use(fileUpload());

router.post(
    "/:id/addFamilyMember/:patientID",
    patientController.addFamilyMember
);
router.get("/:id/familyMembers", patientController.getFamilyMembers);

router.put("/:id/changePackage", patientController.changePatientPackage);

router.post("/:id/newAppointment", patientController.addNewAppointment);
router.get("/:id/appointments", patientController.getPatientAppointments);

router.get("/:id/doctors", patientController.getPatientDoctors);
router.get(
    "/:id/doctorsBasedOnPackage",
    patientController.getDoctorsBasedOnPackage
);

router.post("/:id/newPrescription", patientController.addNewPrescription);
router.get("/:id/prescriptions", patientController.getPatientPrescriptions);

router.post(
    "/:id/uploadMedicalHistoryDocument",
    fileUpload(),
    patientController.addMedicalHistoryDocument
);
router.get(
    "/:id/medicalHistoryDocuments",
    patientController.getMedicalHistoryDocuments
);

module.exports = router;
