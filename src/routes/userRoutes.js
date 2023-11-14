const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/login", userController.login);

router.post("/:id/changePassword", userController.changeUserPassword);

router.get("/resetPassword/:username", userController.generateOTP);

router.post("/files", userController.uploadFile);

router.get("/packages", userController.getAllPackages);

module.exports = router;
