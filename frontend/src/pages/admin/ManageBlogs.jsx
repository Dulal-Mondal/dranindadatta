import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../../components/common/Loader';
import { getBlogs, createBlog, deleteBlog } from '../../services/blogService';
import { BLOG_CATEGORIES } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: 'general',
        isPublished: true,
        thumbnail: null,
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const { data } = await getBlogs({ limit: 50 });
            setBlogs(data.blogs || []);
        } catch (err) {
            toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm({ ...form, thumbnail: file });
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('content', form.content);
            formData.append('excerpt', form.excerpt);
            formData.append('category', form.category);
            formData.append('isPublished', form.isPublished);
            if (form.thumbnail) formData.append('thumbnail', form.thumbnail);

            await createBlog(formData);
            toast.success('Blog created!');
            setForm({ title: '', content: '', excerpt: '', category: 'general', isPublished: true, thumbnail: null });
            setPreview(null);
            setShowForm(false);
            fetchBlogs();
        } catch (err) {
            toast.error('Failed to create blog');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this blog?')) return;
        try {
            await deleteBlog(id);
            toast.success('Blog deleted');
            fetchBlogs();
        } catch (err) {
            toast.error('Failed');
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Blogs</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm transition"
                    >
                        {showForm ? <><FiX size={16} /> Cancel</> : <><FiPlus size={16} /> New Blog</>}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 mb-6 space-y-4">
                        <h3 className="font-semibold text-gray-800">Create New Blog</h3>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Title *</label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                                placeholder="Blog title"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Excerpt</label>
                            <input
                                value={form.excerpt}
                                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                placeholder="Short description"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    {BLOG_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
                                <select
                                    value={form.isPublished}
                                    onChange={(e) => setForm({ ...form, isPublished: e.target.value === 'true' })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="true">Published</option>
                                    <option value="false">Draft</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Content *</label>
                            <textarea
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                required
                                rows={8}
                                placeholder="Write your blog content here..."
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Thumbnail Image</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                            {preview && <img src={preview} alt="preview" className="mt-3 rounded-xl h-36 object-cover" />}
                        </div>

                        <button type="submit" disabled={submitting} className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm transition flex items-center gap-2">
                            {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiPlus size={14} />}
                            Publish Blog
                        </button>
                    </form>
                )}

                {loading ? <Loader /> : blogs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-400">No blogs yet</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Blog</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Category</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Date</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Views</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {blog.thumbnail && (
                                                    <img src={blog.thumbnail} alt={blog.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                                )}
                                                <p className="font-medium text-gray-800 text-sm line-clamp-1">{blog.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full capitalize">{blog.category}</span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-500">{formatDate(blog.createdAt)}</td>
                                        <td className="px-5 py-4 text-sm text-gray-500">{blog.views || 0}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link to={'/blogs/' + blog.slug} className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center transition">
                                                    <FiEye size={14} />
                                                </Link>
                                                <button onClick={() => handleDelete(blog._id)} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg flex items-center justify-center transition">
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ManageBlogs;