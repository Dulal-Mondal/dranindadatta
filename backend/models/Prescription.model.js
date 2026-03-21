const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
        },
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
        patientAge: { type: Number },
        patientSex: { type: String, enum: ['Male', 'Female', 'Other'] },
        diagnosis: {
            type: String,
            required: true,
        },
        medicines: [
            {
                name: { type: String, required: true },
                dosage: { type: String, required: true },   // '500mg'
                frequency: { type: String, required: true }, // 'twice daily'
                duration: { type: String, required: true },  // '7 days'
                notes: { type: String, default: '' },
            },
        ],
        tests: [String],        // ['Blood test', 'X-Ray']
        advice: { type: String, default: '' },
        followUpDate: { type: Date },
        pdfUrl: { type: String, default: '' }, // cloudinary pdf url
    },
    { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);