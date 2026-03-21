const express = require('express');
const router = express.Router();
const {
    getAdminStats,
    getAllDoctors,
    approveDoctor,
    rejectDoctor,
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser,
    getSliders,
    createSlider,
    updateSlider,
    deleteSlider,
    getAllPayments,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');

const admin = [protect, authorize('admin')];

// dashboard
router.get('/stats', ...admin, getAdminStats);

// doctor management
router.get('/doctors', ...admin, getAllDoctors);
router.put('/doctors/:id/approve', ...admin, approveDoctor);
router.put('/doctors/:id/reject', ...admin, rejectDoctor);

// user management
router.get('/users', ...admin, getAllUsers);
router.put('/users/:id/block', ...admin, blockUser);
router.put('/users/:id/unblock', ...admin, unblockUser);
router.delete('/users/:id', ...admin, deleteUser);

// slider management
router.get('/sliders', getSliders); // public
router.post('/sliders', ...admin, uploadImage.single('image'), createSlider);
router.put('/sliders/:id', ...admin, uploadImage.single('image'), updateSlider);
router.delete('/sliders/:id', ...admin, deleteSlider);

// payment management
router.get('/payments', ...admin, getAllPayments);

module.exports = router;