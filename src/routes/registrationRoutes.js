const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");

router.post("/newPatient", registrationController.registerNewPatient);
router.post("/newDoctor", registrationController.registerNewDoctor);

module.exports = router;
