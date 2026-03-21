const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let folder = 'telemedicine/general';
        let resource_type = 'auto';

        if (file.mimetype.startsWith('image/')) folder = 'telemedicine/images';
        if (file.mimetype.startsWith('video/')) folder = 'telemedicine/videos';
        if (file.mimetype === 'application/pdf') folder = 'telemedicine/prescriptions';

        return { folder, resource_type, allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'mp4', 'mov'] };
    },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };