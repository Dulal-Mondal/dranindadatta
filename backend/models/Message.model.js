const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true,
            // format: "userId1_userId2" (sorted)
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            default: '',
        },
        fileUrl: {
            type: String,
            default: '', // image/pdf share korle
        },
        fileType: {
            type: String,
            enum: ['image', 'pdf', 'none'],
            default: 'none',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isEdited: {
            type: Boolean,
            default: false,
        },
        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);