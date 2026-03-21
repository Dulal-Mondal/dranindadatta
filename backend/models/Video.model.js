const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        youtubeUrl: {
            type: String,
            required: true,
            // example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
        },
        youtubeId: {
            type: String,
            required: true,
            // example: dQw4w9WgXcQ
        },
        thumbnail: {
            type: String,
            default: '', // auto generate hobe youtube theke
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        category: {
            type: String,
            enum: ['health-tips', 'exercise', 'nutrition', 'mental-health', 'general'],
            default: 'general',
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// youtube url theke id auto extract
videoSchema.pre('save', function () {
    if (this.isModified('youtubeUrl')) {
        const url = this.youtubeUrl;
        // https://www.youtube.com/watch?v=ID
        // https://youtu.be/ID
        const match = url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
        );
        if (match) {
            this.youtubeId = match[1];
            // youtube er default thumbnail
            this.thumbnail = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
        }
    }
});

module.exports = mongoose.model('Video', videoSchema);