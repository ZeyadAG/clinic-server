const express = require("express");
const appointmentController = require("../controllers/appointmentController");

const router = express.Router();

router.post(
    "/handleAppointmentCardPayment",
    appointmentController.handleAppointmentCardPayment
);

router.get("/patient/:patientID", appointmentController.getPatientAppointments);

router.get("/doctor/:doctorID", appointmentController.getDoctorAppointments);

router.post(
    "/newAppointment/:patientID",
    appointmentController.addNewAppointment
);

router.get(
    "/getFollowUpRequests/patient/:patientID",
    appointmentController.getPatientFollowUpRequests
);

router.get(
    "/getFollowUpRequests/doctor/:doctorID",
    appointmentController.getDoctorFollowUpRequests
);

router.post(
    "/requestFollowUp/:patientID/:doctorID",
    appointmentController.requestFollowUp
);

router.post("/:id/handleFollowUp/", appointmentController.handleFollowUp);

router.post(
    "/:id/rescheduleAppointment/",
    appointmentController.rescheduleAppointment
);

router.post("/:id/cancelAppointment/", appointmentController.cancelAppointment);

module.exports = router;
