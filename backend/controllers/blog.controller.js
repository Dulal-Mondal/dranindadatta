const Blog = require('../models/Blog.model');
const { cloudinary } = require('../config/cloudinary');

// @GET /api/blogs — public, sob published blog
const getBlogs = async (req, res) => {
    const { category, search, page = 1, limit = 9 } = req.query;

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
        .populate('author', 'name avatar role')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    res.status(200).json({ success: true, total, blogs });
};

// @GET /api/blogs/:slug — single blog
const getBlogBySlug = async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
        .populate('author', 'name avatar role');

    if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // view count badao
    blog.views += 1;
    await blog.save();

    res.status(200).json({ success: true, blog });
};

// @POST /api/blogs — admin & doctor create korte parbe
const createBlog = async (req, res) => {
    const { title, content, excerpt, category, tags, isPublished } = req.body;

    const thumbnailUrl = req.file ? req.file.path : '';

    const blog = await Blog.create({
        title,
        content,
        excerpt,
        thumbnail: thumbnailUrl,
        category,
        tags: tags ? JSON.parse(tags) : [],
        isPublished: isPublished === 'true',
        author: req.user._id,
    });

    await blog.populate('author', 'name avatar');

    res.status(201).json({ success: true, blog });
};

// @PUT /api/blogs/:id — update
const updateBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // শুধু author বা admin update করতে পারবে
    if (
        blog.author.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updateData = { ...req.body };
    if (req.file) updateData.thumbnail = req.file.path;
    if (req.body.tags) updateData.tags = JSON.parse(req.body.tags);

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
    }).populate('author', 'name avatar');

    res.status(200).json({ success: true, blog: updated });
};

// @DELETE /api/blogs/:id
const deleteBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (
        blog.author.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // cloudinary থেকে thumbnail delete
    if (blog.thumbnail) {
        const publicId = blog.thumbnail.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`telemedicine/images/${publicId}`);
    }

    await blog.deleteOne();
    res.status(200).json({ success: true, message: 'Blog deleted' });
};

// @GET /api/blogs/my — doctor er nijer blogs
const getMyBlogs = async (req, res) => {
    const blogs = await Blog.find({ author: req.user._id })
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, blogs });
};

module.exports = { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, getMyBlogs };