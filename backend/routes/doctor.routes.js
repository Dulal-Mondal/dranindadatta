// const express = require('express');
// const router = express.Router();
// const {
//     getAllDoctors,
//     getDoctorById,
//     getMyProfile,
//     updateDoctorProfile,
//     updateAvatar,
//     uploadImages,
//     uploadVideos,
//     deleteImage,
//     deleteVideo,
//     blockPatient,
//     getDoctorStats,
// } = require('../controllers/doctor.controller');
// const { protect, authorize } = require('../middleware/auth.middleware');
// const { uploadImage, uploadVideo, uploadAvatar } = require('../middleware/upload.middleware');

// // public routes
// router.get('/', getAllDoctors);
// router.get('/:id', getDoctorById);

// // doctor only routes
// router.get('/profile/me', protect, authorize('doctor'), getMyProfile);
// router.put('/profile/update', protect, authorize('doctor'), updateDoctorProfile);
// router.put('/avatar', protect, authorize('doctor'), uploadAvatar.single('avatar'), updateAvatar);
// router.post('/upload-images', protect, authorize('doctor'), uploadImage.array('images', 10), uploadImages);
// router.post('/upload-videos', protect, authorize('doctor'), uploadVideo.array('videos', 5), uploadVideos);
// router.delete('/delete-image', protect, authorize('doctor'), deleteImage);
// router.delete('/delete-video', protect, authorize('doctor'), deleteVideo);
// router.put('/block-patient/:patientId', protect, authorize('doctor'), blockPatient);
// router.get('/dashboard/stats', protect, authorize('doctor'), getDoctorStats);

// module.exports = router;


const express = require('express');
const router = express.Router();
const {
    getAllDoctors,
    getDoctorById,
    getMyProfile,
    updateDoctorProfile,
    updateAvatar,
    uploadImages,
    uploadVideos,
    deleteImage,
    deleteVideo,
    blockPatient,
    getDoctorStats,
} = require('../controllers/doctor.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadImage, uploadVideo, uploadAvatar } = require('../middleware/upload.middleware');

// ✅ Public routes
router.get('/', getAllDoctors);

// ✅ FIXED: Static routes আগে রাখা হয়েছে — না হলে /:id এগুলোকে match করে নিত
router.get('/profile/me', protect, authorize('doctor'), getMyProfile);
router.get('/dashboard/stats', protect, authorize('doctor'), getDoctorStats);

// ✅ Dynamic route সবার শেষে
router.get('/:id', getDoctorById);

// Doctor only routes
router.put('/profile/update', protect, authorize('doctor'), updateDoctorProfile);
router.put('/avatar', protect, authorize('doctor'), uploadAvatar.single('avatar'), updateAvatar);
router.post('/upload-images', protect, authorize('doctor'), uploadImage.array('images', 10), uploadImages);
router.post('/upload-videos', protect, authorize('doctor'), uploadVideo.array('videos', 5), uploadVideos);
router.delete('/delete-image', protect, authorize('doctor'), deleteImage);
router.delete('/delete-video', protect, authorize('doctor'), deleteVideo);
router.put('/block-patient/:patientId', protect, authorize('doctor'), blockPatient);

module.exports = router;