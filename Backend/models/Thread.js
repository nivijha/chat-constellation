import mongoose from "mongoose";
import crypto from "crypto";

const MessageSchema = new  mongoose.Schema({
    messageId: {
        type: String,
        default: () => crypto.randomUUID()
    },
    parentId: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ["user", "assisstant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const ThreadSchema = new  mongoose.Schema({
    threadID: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [MessageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Thread", ThreadSchema);