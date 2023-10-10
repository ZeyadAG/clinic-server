const express = require("express");
const mongoose = require("mongoose");

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

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Welcome!");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
