const express = require('express');
const router = express.Router();
const { getPublicSettings, getSettings, updateSettings } = require('../controllers/settings.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { isActiveUser } = require('../middleware/role.middleware');

// Public — frontend এ pixel/GA init করতে
router.get('/public', getPublicSettings);

// Admin only
router.get('/', protect, isActiveUser, authorize('admin'), getSettings);
router.put('/', protect, isActiveUser, authorize('admin'), updateSettings);

module.exports = router;