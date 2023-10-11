const express = require("express");
const registrationController = require("../controllers/registrationController");

const router = express.Router();

router.post("/newPatient", registrationController.registerNewPatient);

router.post("/newDoctor", registrationController.registerNewDoctor);

module.exports = router;
