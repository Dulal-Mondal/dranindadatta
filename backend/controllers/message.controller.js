const Message = require('../models/Message.model');
const Conversation = require('../models/Conversation.model');
const { upload } = require('../config/cloudinary');

// conversation id banano (always sorted)
const makeConversationId = (id1, id2) => {
    return [id1.toString(), id2.toString()].sort().join('_');
};

// @GET /api/messages/conversations
// User er sob conversation list
const getConversations = async (req, res) => {
    const conversations = await Conversation.find({
        participants: req.user._id,
    })
        .populate('participants', 'name avatar role')
        .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, conversations });
};

// @GET /api/messages/:userId
// Specific user er sathe conversation fetch
const getMessages = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 30 } = req.query;

    const conversationId = makeConversationId(req.user._id, userId);

    const messages = await Message.find({ conversationId })
        .populate('sender', 'name avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    // unread messages gulo read mark koro
    await Message.updateMany(
        {
            conversationId,
            receiver: req.user._id,
            isRead: false,
        },
        { isRead: true }
    );

    // conversation unread count reset
    await Conversation.findOneAndUpdate(
        { conversationId },
        { [`unreadCount.${req.user._id}`]: 0 }
    );

    res.status(200).json({
        success: true,
        messages: messages.reverse(), // purano message age
    });
};

// @POST /api/messages/send
// Message send (REST fallback, mainly socket use hobe)
const sendMessage = async (req, res) => {
    const { receiverId, text, replyTo } = req.body;

    if (!text?.trim()) {
        return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const conversationId = makeConversationId(req.user._id, receiverId);

    const message = await Message.create({
        conversationId,
        sender: req.user._id,
        receiver: receiverId,
        text: text.trim(),
        replyTo: replyTo || null,
    });

    await message.populate('sender', 'name avatar');

    // conversation update/create
    await Conversation.findOneAndUpdate(
        { conversationId },
        {
            conversationId,
            participants: [req.user._id, receiverId],
            lastMessage: {
                text: text.trim(),
                sender: req.user._id,
                createdAt: new Date(),
            },
            $inc: { [`unreadCount.${receiverId}`]: 1 },
        },
        { upsert: true, new: true }
    );

    res.status(201).json({ success: true, message });
};

// @POST /api/messages/send-file
// File/image message send
const sendFileMessage = async (req, res) => {
    const { receiverId, fileType } = req.body;

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const conversationId = makeConversationId(req.user._id, receiverId);

    const message = await Message.create({
        conversationId,
        sender: req.user._id,
        receiver: receiverId,
        text: '',
        fileUrl: req.file.path,
        fileType: fileType || 'image',
    });

    await message.populate('sender', 'name avatar');

    await Conversation.findOneAndUpdate(
        { conversationId },
        {
            conversationId,
            participants: [req.user._id, receiverId],
            lastMessage: {
                text: fileType === 'pdf' ? '📄 PDF sent' : '🖼️ Image sent',
                sender: req.user._id,
                createdAt: new Date(),
            },
            $inc: { [`unreadCount.${receiverId}`]: 1 },
        },
        { upsert: true, new: true }
    );

    res.status(201).json({ success: true, message });
};

// @DELETE /api/messages/:messageId
const deleteMessage = async (req, res) => {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
        return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await message.deleteOne();

    res.status(200).json({ success: true, message: 'Message deleted' });
};


const editMessage = async (req, res) => {
    const { text } = req.body;
    const message = await Message.findById(req.params.messageId);

    if (!message) {
        return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    message.text = text;
    message.isEdited = true;
    await message.save();

    res.status(200).json({ success: true, message });
};



module.exports = {
    getConversations,
    getMessages,
    sendMessage,
    sendFileMessage,
    deleteMessage,
    editMessage,
};