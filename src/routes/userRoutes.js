const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/login", userController.login);

router.post("/:id/changePassword", userController.changeUserPassword);

router.get("/resetPassword/:username", userController.generateOTP);

router.post("/files", userController.uploadFile);

router.get("/packages", userController.getAllPackages);

router.get("/:userID/notifications", userController.getUserNotifications);

router.get("/chat/:firstUserID/:secondUserID", userController.getUsersChat);

router.post(
    "/chat/newMessage/:firstUserID/:secondUserID",
    userController.sendChatMessage
);

module.exports = router;
