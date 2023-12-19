const express = require("express");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

router.put("/:id/updateInfo", doctorController.updateDoctorInfo);

router.get("/:id/patients", doctorController.getDoctorPatients);

router.get("/:id/patients/:patientName", doctorController.getPatientByName);

router.post(
    "/:id/addHealthRecord/:patientID",
    doctorController.addHealthRecordForPatient
);

router.post(
    "/:id/acceptEmploymentContract",
    doctorController.acceptEmploymentContract
);

router.post("/:id/addTimeslot", doctorController.addTimeslot);

router.post("/:id/handleWalletPayment", doctorController.handleWalletPayment);

module.exports = router;
