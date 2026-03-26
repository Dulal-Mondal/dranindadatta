// const mongoose = require('mongoose');

// const blogSchema = new mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: true,
//             trim: true,
//         },
//         slug: {
//             type: String,
//             unique: true,
//             lowercase: true,
//         },
//         content: {
//             type: String,
//             required: true, // rich text / HTML content
//         },
//         excerpt: {
//             type: String,
//             default: '', // short description
//         },
//         thumbnail: {
//             type: String,
//             default: '', // cloudinary image url
//         },
//         author: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true,
//         },
//         category: {
//             type: String,
//             enum: ['health-tips', 'nutrition', 'mental-health', 'disease', 'general'],
//             default: 'general',
//         },
//         tags: [String], // ['diabetes', 'heart', 'diet']
//         isPublished: {
//             type: Boolean,
//             default: false,
//         },
//         views: {
//             type: Number,
//             default: 0,
//         },
//     },
//     { timestamps: true }
// );

// // title theke auto slug generate
// blogSchema.pre('save', function () {
//     if (this.isModified('title')) {
//         this.slug = this.title
//             .toLowerCase()
//             .replace(/[^a-z0-9]+/g, '-')
//             .replace(/(^-|-$)/g, '');
//     }
// });

// module.exports = mongoose.model('Blog', blogSchema);


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
            default: '',
        },
        content: {
            type: String,
            required: true,
        },
        excerpt: {
            type: String,
            default: '',
        },
        thumbnail: {
            type: String,
            default: '',
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
        tags: [String],
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

// ── Slug generate helper ─────────────────────────────
const generateSlug = (title) => {
    return title
        .trim()
        .toLowerCase()
        // বাংলা ও ইংরেজি অক্ষর রাখো, বাকি সব dash করো
        .replace(/[\s\u0964\u0965।,\.!?'"()\[\]{}@#$%^&*+=|\\/<>:;]+/g, '-')
        // multiple dashes একটা করো
        .replace(/-+/g, '-')
        // শুরু ও শেষের dash সরাও
        .replace(/(^-|-$)/g, '');
};

// ── Pre-save hook ────────────────────────────────────
blogSchema.pre('save', async function () {
    // শুধু title change হলে বা slug খালি থাকলে generate করো
    if (this.isModified('title') || !this.slug) {
        let baseSlug = generateSlug(this.title);

        // slug খালি হলে (বাংলা only title) _id দিয়ে fallback
        if (!baseSlug) {
            baseSlug = this._id.toString();
        }

        // unique slug নিশ্চিত করো
        let slug = baseSlug;
        let count = 1;
        while (await mongoose.model('Blog').findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }

        this.slug = slug;
    }
});

module.exports = mongoose.model('Blog', blogSchema);