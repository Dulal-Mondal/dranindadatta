const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        appointmentDate: {
            type: Date,
            required: true,
        },
        timeSlot: {
            type: String,
            required: true, // '10:00 - 10:30'
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
            default: 'pending',
        },
        type: {
            type: String,
            enum: ['video', 'chat'],
            default: 'video',
        },
        symptoms: {
            type: String,
            default: '',
        },
        fee: {
            type: Number,
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paymentInfo: {
            transactionId: String,
            method: String,   // 'sslcommerz' | 'stripe'
            paidAt: Date,
        },
        videoRoomId: {
            type: String,
            default: '',  // WebRTC room id
        },
        videoJoinUrl: {
            type: String,
            default: '',
        },
        notes: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);