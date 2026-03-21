const express = require('express');
const router = express.Router();
const {
    getMyProfile,
    updatePatientProfile,
    updateAvatar,
    addMedicalHistory,
    deleteMedicalHistory,
    getPatientStats,
    getFullHistory,
} = require('../controllers/patient.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadAvatar } = require('../middleware/upload.middleware');

router.get('/profile/me', protect, authorize('patient'), getMyProfile);
router.put('/profile/update', protect, authorize('patient'), updatePatientProfile);
router.put('/avatar', protect, authorize('patient'), uploadAvatar.single('avatar'), updateAvatar);
router.post('/medical-history', protect, authorize('patient'), addMedicalHistory);
router.delete('/medical-history/:historyId', protect, authorize('patient'), deleteMedicalHistory);
router.get('/dashboard/stats', protect, authorize('patient'), getPatientStats);
router.get('/full-history', protect, authorize('patient'), getFullHistory);

module.exports = router;