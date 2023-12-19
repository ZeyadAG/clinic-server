const express = require("express");
const patientController = require("../controllers/patientController");
const fileUpload = require("express-fileupload");

const router = express.Router();

router.post(
    "/:id/addFamilyMember/:patientID",
    patientController.addFamilyMember
);

router.get("/:id/familyMembers", patientController.getFamilyMembers);

router.post(
    "/:id/changePackage/:packageID",
    patientController.changePatientPackage
);

router.post(
    "/:id/cancelPackageSubscription/",
    patientController.cancelPackageSubscription
);

router.post("/:id/handleWalletPayment", patientController.handleWalletPayment);

router.post(
    "/handlePackageCardPayment",
    patientController.handlePackageCardPayment
);

router.get("/:id/doctors", patientController.getPatientDoctors);

router.get(
    "/:id/doctorsBasedOnPackage",
    patientController.getDoctorsBasedOnPackage
);

router.post(
    "/:id/uploadMedicalHistoryDocument",
    fileUpload(),
    patientController.addMedicalHistoryDocument
);

router.post(
    "/:id/removeMedicalHistoryDocument",
    patientController.removeMedicalHistoryDocument
);

router.get(
    "/:id/medicalHistoryDocuments",
    patientController.getMedicalHistoryDocuments
);

module.exports = router;
