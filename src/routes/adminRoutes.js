const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/", adminController.getDataForAdmin);

router.post("/newAdmin", adminController.addNewAdmin);

router.delete("/removeUser/:userID", adminController.deleteUser);

router.put("/acceptDoctor/:id", adminController.acceptDoctor);

router.post("/newPackage", adminController.addNewPackage);
router.put("/updatePackage/:packageID", adminController.updatePackage);
router.delete("/removePackage/:packageID", adminController.removePackage);

module.exports = router;
