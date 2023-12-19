const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    first_user: { type: Schema.Types.ObjectId, ref: "User" },
    second_user: { type: Schema.Types.ObjectId, ref: "User" },

    messages: [
        {
            message: String,
            sent_at: Date,
            sender: { type: Schema.Types.ObjectId, ref: "User" },
        },
    ],
});

module.exports = mongoose.model("Chat", chatSchema);
