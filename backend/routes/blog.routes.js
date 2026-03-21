const express = require('express');
const router = express.Router();
const {
    getBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    getMyBlogs,
} = require('../controllers/blog.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');

// public
router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);

// doctor & admin
router.post(
    '/',
    protect,
    authorize('doctor', 'admin'),
    uploadImage.single('thumbnail'),
    createBlog
);
router.put(
    '/:id',
    protect,
    authorize('doctor', 'admin'),
    uploadImage.single('thumbnail'),
    updateBlog
);
router.delete('/:id', protect, authorize('doctor', 'admin'), deleteBlog);
router.get('/author/my', protect, authorize('doctor', 'admin'), getMyBlogs);

module.exports = router;