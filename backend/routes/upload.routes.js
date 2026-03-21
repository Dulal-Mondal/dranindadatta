const express = require('express');
const router = express.Router();
const {
    uploadAvatar,
    uploadDoctorImages,
    uploadDoctorVideos,
    deleteFile,
    getUploadSignature,
} = require('../controllers/upload.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadAvatar: avatarUpload, uploadImage, uploadVideo } = require('../middleware/upload.middleware');

// avatar - patient & doctor dono use korte parbe
router.post('/avatar', protect, avatarUpload.single('avatar'), uploadAvatar);

// doctor only
router.post('/doctor-images', protect, authorize('doctor'), uploadImage.array('images', 10), uploadDoctorImages);
router.post('/doctor-videos', protect, authorize('doctor'), uploadVideo.array('videos', 5), uploadDoctorVideos);

// file delete
router.delete('/delete', protect, deleteFile);

// cloudinary signature (direct upload er jonno)
router.get('/signature', protect, getUploadSignature);

module.exports = router;