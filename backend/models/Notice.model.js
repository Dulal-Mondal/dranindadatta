const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },
        color: {
            type: String,
            default: '#0ea5e9', // primary-500
        },
        bgColor: {
            type: String,
            default: '#eff6ff',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);