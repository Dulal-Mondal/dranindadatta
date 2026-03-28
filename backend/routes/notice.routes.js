const express = require('express');
const router = express.Router();
const {
    getPublicNotices,
    getAllNotices,
    createNotice,
    updateNotice,
    deleteNotice,
} = require('../controllers/notice.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// ✅ Public — Navbar notice scroll
router.get('/public', getPublicNotices);

// ✅ Admin only
router.get('/', protect, authorize('admin'), getAllNotices);
router.post('/', protect, authorize('admin'), createNotice);
router.put('/:id', protect, authorize('admin'), updateNotice);
router.delete('/:id', protect, authorize('admin'), deleteNotice);

module.exports = router;