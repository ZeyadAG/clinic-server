const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/login");
});

// REGISTRATION
router.all("/register");

router.post("/register/newPatient");
router.post("/register/newDoctor");

// ADMIN
router.all("/admin");

router.post("/admin/newAdmin");
router.delete("/admin/removeUser/:userID");
// can be the id of any user, the handler function will figure out which type of user and will remove him from db

router.post("/admin/newPackage");
router.delete("/admin/removePackage/:id");
router.put("/admin/updatePackage/:id");

// DOCTOR
router.all("/doctor");

router.put("/doctor/:id/updateInfo");
router.get("/doctor/:id/patients");
router.get("/doctor/:id/patients/:patientName");
router.get("/doctor/:id/appointments");

// PATIENT
router.all("/patient");

router.post("/patient/:id/addFamilyMember");
router.get("/patient/:id/familyMembers");

// OTHER

// 23 - filter appointments by date/status
// localhost:5000/appointments?start_time=000&end_time=000&status=upcoming
router.get("/");
