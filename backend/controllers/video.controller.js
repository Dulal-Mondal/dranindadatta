const Video = require('../models/Video.model');

// @GET /api/videos — public
const getVideos = async (req, res) => {
    const { category, page = 1, limit = 9 } = req.query;

    const filter = { isPublished: true };
    if (category) filter.category = category;

    const total = await Video.countDocuments(filter);
    const videos = await Video.find(filter)
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    res.status(200).json({ success: true, total, videos });
};

// @POST /api/videos — admin & doctor
const createVideo = async (req, res) => {
    const { title, description, youtubeUrl, category } = req.body;

    // youtube url validate
    const match = youtubeUrl.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    if (!match) {
        return res.status(400).json({ success: false, message: 'Invalid YouTube URL' });
    }

    const video = await Video.create({
        title,
        description,
        youtubeUrl,
        youtubeId: match[1],
        category,
        author: req.user._id,
    });

    await video.populate('author', 'name avatar');
    res.status(201).json({ success: true, video });
};

// @DELETE /api/videos/:id
const deleteVideo = async (req, res) => {
    const video = await Video.findById(req.params.id);

    if (!video) {
        return res.status(404).json({ success: false, message: 'Video not found' });
    }

    if (
        video.author.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await video.deleteOne();
    res.status(200).json({ success: true, message: 'Video deleted' });
};

// @PUT /api/videos/:id
const updateVideo = async (req, res) => {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    if (!video) {
        return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.status(200).json({ success: true, video });
};

module.exports = { getVideos, createVideo, deleteVideo, updateVideo };