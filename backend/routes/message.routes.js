const express = require('express');
const router = express.Router();
const {
    getConversations,
    getMessages,
    sendMessage,
    sendFileMessage,
    deleteMessage,
    editMessage
} = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.post('/send', protect, sendMessage);
router.post('/send-file', protect, upload.single('file'), sendFileMessage);
router.delete('/:messageId', protect, deleteMessage);
router.put('/:messageId', protect, editMessage);


module.exports = router;