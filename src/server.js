//* IMPORTS *//
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const registrationRouter = require("./routes/registrationRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const patientRouter = require("./routes/patientRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");
const prescriptionRouter = require("./routes/prescriptionRoutes");

//* SETUP *//
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 6000;

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URI);

const db = mongoose.connection;
db.on("error", () => {
    console.log("Failed to connect to database");
});
db.once("open", () => {
    console.log("Connected to database succefully");
});

//* APP *//
const app = express();

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://localhost:${PORT}...`);
});

// MIDDLEWARE
app.use(express.json());
app.use(express.json({ limit: "500mb" }));
app.use(cors());

// ROUTES
app.get("/", (req, res) => {
    res.status(200).send("Welcome to Olayan");
});

app.use("/register", registrationRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/doctor", doctorRouter);
app.use("/patient", patientRouter);
app.use("/appointment", appointmentRouter);
app.use("/prescription", prescriptionRouter);
