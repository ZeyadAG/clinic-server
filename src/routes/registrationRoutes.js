const express = require("express");
const registrationController = require("../controllers/registrationController");
const fileUpload = require("express-fileupload");

const router = express.Router();

router.post("/newPatient", registrationController.registerNewPatient);

router.post(
    "/newDoctor",
    fileUpload(),
    registrationController.registerNewDoctor
);

module.exports = router;
