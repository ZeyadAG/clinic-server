const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/login", userController.login);
router.post("/:id/changePassword/", userController.changeUserPassword);
router.get("/:id/resetPassword/", userController.generateOTP);

module.exports = router;
