const express = require("express");
const patientController = require("../controllers/patientController");

const router = express.Router();

router.post("/:id/addFamilyMember", patientController.addFamilyMember);
router.get("/:id/familyMembers", patientController.getFamilyMembers);

router.post("/:id/newAppointment", patientController.addNewAppointment);
router.get("/:id/appointments", patientController.getPatientAppointments);

router.get("/:id/doctors", patientController.getPatientDoctors);

router.post("/:id/newPrescription", patientController.addNewPrescription);
router.get("/:id/prescriptions", patientController.getPatientPrescriptions);

module.exports = router;
