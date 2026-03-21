const { cloudinary } = require('../config/cloudinary');
const Doctor = require('../models/Doctor.model');
const User = require('../models/User.model');

// @POST /api/upload/avatar
// User avatar upload (patient & doctor)
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const avatarUrl = req.file.path;

        // user avatar update
        await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl });

        res.status(200).json({
            success: true,
            message: 'Avatar uploaded successfully',
            avatarUrl,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @POST /api/upload/doctor-images
// Doctor multiple images upload
const uploadDoctorImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No images uploaded' });
        }

        const imageUrls = req.files.map((file) => file.path);

        const doctor = await Doctor.findOneAndUpdate(
            { user: req.user._id },
            { $push: { images: { $each: imageUrls } } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `${imageUrls.length} image(s) uploaded`,
            images: doctor.images,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @POST /api/upload/doctor-videos
// Doctor multiple videos upload
const uploadDoctorVideos = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No videos uploaded' });
        }

        const videoUrls = req.files.map((file) => file.path);

        const doctor = await Doctor.findOneAndUpdate(
            { user: req.user._id },
            { $push: { videos: { $each: videoUrls } } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `${videoUrls.length} video(s) uploaded`,
            videos: doctor.videos,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @DELETE /api/upload/delete
// Cloudinary theke file delete
const deleteFile = async (req, res) => {
    try {
        const { publicId, resourceType = 'image' } = req.body;

        if (!publicId) {
            return res.status(400).json({ success: false, message: 'Public ID is required' });
        }

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType, // 'image' | 'video' | 'raw'
        });

        if (result.result !== 'ok') {
            return res.status(400).json({ success: false, message: 'File deletion failed' });
        }

        res.status(200).json({ success: true, message: 'File deleted from cloudinary' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @GET /api/upload/signature
// Frontend direct upload er jonno cloudinary signature generate
const getUploadSignature = (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = req.query.folder || 'telemedicine/general';

        const signature = cloudinary.utils.api_sign_request(
            { timestamp, folder },
            process.env.CLOUDINARY_API_SECRET
        );

        res.status(200).json({
            success: true,
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            folder,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    uploadAvatar,
    uploadDoctorImages,
    uploadDoctorVideos,
    deleteFile,
    getUploadSignature,
};