const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        content: {
            type: String,
            required: true, // rich text / HTML content
        },
        excerpt: {
            type: String,
            default: '', // short description
        },
        thumbnail: {
            type: String,
            default: '', // cloudinary image url
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            enum: ['health-tips', 'nutrition', 'mental-health', 'disease', 'general'],
            default: 'general',
        },
        tags: [String], // ['diabetes', 'heart', 'diet']
        isPublished: {
            type: Boolean,
            default: false,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// title theke auto slug generate
blogSchema.pre('save', function () {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
});

module.exports = mongoose.model('Blog', blogSchema);