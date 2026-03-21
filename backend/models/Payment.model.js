const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
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
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'BDT',
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        method: {
            type: String,
            enum: ['sslcommerz', 'stripe'],
            default: 'sslcommerz',
        },
        status: {
            type: String,
            enum: ['pending', 'success', 'failed', 'refunded'],
            default: 'pending',
        },
        paidAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);