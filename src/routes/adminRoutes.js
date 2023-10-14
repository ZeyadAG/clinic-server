const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/", adminController.getDataForAdmin);

router.post("/newAdmin", adminController.addNewAdmin);

router.delete("/removeUser/:userID", adminController.deleteUser);

router.put("/acceptDoctor/:id", adminController.acceptDoctor);

router.get("/packages", adminController.getAllPackages);
router.post("/newPackage", adminController.addNewPackage);
router.put("/updatePackage/:id", adminController.updatePackage);
router.delete("/removePackage/:id", adminController.removePackage);

module.exports = router;
