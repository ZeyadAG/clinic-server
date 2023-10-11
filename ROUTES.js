const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/login");
});

// REGISTRATION and LOGIN
router.all("/register");

router.post("/register/newPatient", loginController.registerNewPatient);
router.post("/register/newDoctor", loginController.registerNewDoctor);
router.post("/login", loginController.loginUser);

// ADMIN
router.all("/admin");

router.post("/admin/newAdmin");

//tbd
router.delete("/admin/removeUser/:userID"); // * by name?
// can be the id of any user, the handler function will figure out which type of user and will remove him from db
router.get("admin/doctorRequests");

router.post("/admin/newPackage");

//tbd
router.delete("/admin/removePackage/:id");
//tbd
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

// 23 - patient/doc: filter appointments by date/status

// 34 - doctor: search for patient by name
//   ay patient fel system walla el patients beta3t el doctor?

// 35 - doctor: filter patients based on upcoming appointments

//

//
/* // PHARMACY // */
//

//
