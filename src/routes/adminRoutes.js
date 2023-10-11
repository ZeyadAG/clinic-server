const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.post("/newAdmin", adminController.addNewAdmin);

module.exports = router;
