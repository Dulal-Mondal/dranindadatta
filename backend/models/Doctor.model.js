const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        specialization: {
            type: String,
            required: true,
        },
        qualifications: [String], // ['MBBS', 'MD']
        experience: {
            type: Number,
            default: 0, // years
        },
        consultationFee: {
            type: Number,
            required: true,
            default: 500,
        },
        bio: {
            type: String,
            default: '',
        },
        images: [String],   // cloudinary urls
        videos: [String],   // cloudinary urls
        availableSlots: [
            {
                day: String,       // 'Monday'
                startTime: String, // '10:00'
                endTime: String,   // '18:00'
            },
        ],
        rating: {
            type: Number,
            default: 0,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        isApproved: {
            type: Boolean,
            default: false, // admin approve korbe
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);