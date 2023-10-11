const express = require("express");
const patientController = require("../controllers/patientController");

const router = express.Router();

router.post("/:id/addFamilyMember", patientController.addFamilyMember);
router.get("/:id/familyMembers"), patientController.getFamilyMembers;

module.exports = router;
