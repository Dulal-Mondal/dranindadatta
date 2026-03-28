const Notice = require('../models/Notice.model');

// @GET /api/notices/public
// Sob active notice (public — Navbar er jonno)
const getPublicNotices = async (req, res) => {
    const notices = await Notice.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, notices });
};

// @GET /api/notices
// Admin — sob notice (active + inactive)
const getAllNotices = async (req, res) => {
    const notices = await Notice.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, notices });
};

// @POST /api/notices
// Admin — notice create
const createNotice = async (req, res) => {
    const { text, color, bgColor, order } = req.body;

    if (!text) {
        return res.status(400).json({ success: false, message: 'Notice text is required' });
    }

    const notice = await Notice.create({ text, color, bgColor, order });
    res.status(201).json({ success: true, notice });
};

// @PUT /api/notices/:id
// Admin — notice update (text, color, bgColor, isActive, order)
const updateNotice = async (req, res) => {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!notice) {
        return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    res.status(200).json({ success: true, notice });
};

// @DELETE /api/notices/:id
// Admin — notice delete
const deleteNotice = async (req, res) => {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
        return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    res.status(200).json({ success: true, message: 'Notice deleted' });
};

module.exports = {
    getPublicNotices,
    getAllNotices,
    createNotice,
    updateNotice,
    deleteNotice,
};