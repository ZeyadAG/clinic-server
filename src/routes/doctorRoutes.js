const express = require("express");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

router.put("/:id/updateInfo", doctorController.updateDoctorInfo);

router.get("/:id/patients", doctorController.getDoctorPatients);
router.get("/:id/patients/:patientName", doctorController.getPatientByName);

router.get("/:id/appointments", doctorController.getDoctorAppointments);

router.post(
    "/:id/addHealthRecord/:patientID",
    doctorController.addHealthRecordForPatient
);

router.post(
    "/:id/acceptEmploymentContract",
    doctorController.acceptEmploymentContract
);

module.exports = router;
