import { useState } from 'react';
import { BLOG_CATEGORIES } from '../../utils/constants';
import { FiUpload } from 'react-icons/fi';

const BlogEditor = ({ onSubmit, loading, initialData = {} }) => {
    const [form, setForm] = useState({
        title: initialData.title || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        category: initialData.category || 'general',
        isPublished: initialData.isPublished !== undefined ? initialData.isPublished : true,
        thumbnail: null,
    });
    const [preview, setPreview] = useState(initialData.thumbnail || null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm({ ...form, thumbnail: file });
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
            if (form[key] !== null) formData.append(key, form[key]);
        });
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="Blog title"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label>
                <input
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Short description"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {BLOG_CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                    <select
                        value={form.isPublished}
                        onChange={(e) => setForm({ ...form, isPublished: e.target.value === 'true' })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Content *</label>
                <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                    rows={10}
                    placeholder="Write your blog content here..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail</label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary-400 transition">
                    {preview ? (
                        <img src={preview} alt="preview" className="h-full w-full object-cover rounded-xl" />
                    ) : (
                        <div className="text-center">
                            <FiUpload size={24} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload thumbnail</p>
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    'Publish Blog'
                )}
            </button>
        </form>
    );
};

export default BlogEditor;