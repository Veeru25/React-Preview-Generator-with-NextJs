const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "model"], // Specifies who sent the message
        required: true,
    },
    parts: [
        {
            text: {
                type: String, // The actual message content
                required: true,
            },
        },
    ],
});

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    chatName: {
        type: String,
        default: "Untitled Chat",
    },
    messages: [messageSchema], // Embeds the message schema
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const HistoryModel = mongoose.models.history || mongoose.model("history", historySchema);

export default HistoryModel;
