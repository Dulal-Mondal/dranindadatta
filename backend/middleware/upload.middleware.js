const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// ─── IMAGE UPLOAD ──────────────────────────────────────
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'telemedicine/images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, quality: 'auto' }],
    },
});

// ─── VIDEO UPLOAD ──────────────────────────────────────
const videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'telemedicine/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi'],
    },
});

// ─── PDF UPLOAD ────────────────────────────────────────
const pdfStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'telemedicine/prescriptions',
        resource_type: 'raw',
        allowed_formats: ['pdf'],
    },
});

// ─── AVATAR UPLOAD ─────────────────────────────────────
const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'telemedicine/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 300, height: 300, crop: 'fill', quality: 'auto' }],
    },
});

// file size limits
const limits = { fileSize: 50 * 1024 * 1024 }; // 50MB

const uploadImage = multer({ storage: imageStorage, limits });
const uploadVideo = multer({ storage: videoStorage, limits });
const uploadPDF = multer({ storage: pdfStorage, limits });
const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 5 * 1024 * 1024 } });

// multiple file type ek sathe handle
const uploadMixed = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => {
            if (file.mimetype.startsWith('image/')) {
                return { folder: 'telemedicine/images', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] };
            }
            if (file.mimetype.startsWith('video/')) {
                return { folder: 'telemedicine/videos', resource_type: 'video', allowed_formats: ['mp4', 'mov'] };
            }
            if (file.mimetype === 'application/pdf') {
                return { folder: 'telemedicine/prescriptions', resource_type: 'raw', allowed_formats: ['pdf'] };
            }
            return { folder: 'telemedicine/general' };
        },
    }),
    limits,
});

module.exports = { uploadImage, uploadVideo, uploadPDF, uploadAvatar, uploadMixed };