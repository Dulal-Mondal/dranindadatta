const express = require('express');
const router = express.Router();
const {
    getVideos,
    createVideo,
    deleteVideo,
    updateVideo,
} = require('../controllers/video.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// public
router.get('/', getVideos);

// admin & doctor
router.post('/', protect, authorize('admin', 'doctor'), createVideo);
router.put('/:id', protect, authorize('admin', 'doctor'), updateVideo);
router.delete('/:id', protect, authorize('admin', 'doctor'), deleteVideo);

module.exports = router;