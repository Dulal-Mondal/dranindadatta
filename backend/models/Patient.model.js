const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        bloodGroup: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            default: '',
        },
        medicalHistory: [
            {
                condition: String,
                diagnosedAt: Date,
                notes: String,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);