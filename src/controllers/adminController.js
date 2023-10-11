const User = require("../models/User");

const addNewAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = new User({
            username,
            password,
            admin: true,
        });
        await admin.save();
        return res.status(201).json(admin);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

module.exports = { addNewAdmin };
