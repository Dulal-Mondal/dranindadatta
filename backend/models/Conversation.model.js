const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true,
            unique: true,
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        lastMessage: {
            text: String,
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            createdAt: Date,
        },
        unreadCount: {
            type: Map,
            of: Number,
            default: {},
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);