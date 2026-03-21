import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../../components/common/Loader';
import { getVideos, createVideo, deleteVideo } from '../../services/videoService';
import { VIDEO_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const ManageVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', youtubeUrl: '', category: 'general' });

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const { data } = await getVideos();
            setVideos(data.videos || []);
        } catch (err) {
            toast.error('Failed to load videos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createVideo(form);
            toast.success('Video added!');
            setForm({ title: '', description: '', youtubeUrl: '', category: 'general' });
            setShowForm(false);
            fetchVideos();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add video');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this video?')) return;
        try {
            await deleteVideo(id);
            toast.success('Video deleted');
            fetchVideos();
        } catch (err) {
            toast.error('Failed');
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Videos</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm transition"
                    >
                        {showForm ? <><FiX size={16} /> Cancel</> : <><FiPlus size={16} /> Add Video</>}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 mb-6 space-y-4">
                        <h3 className="font-semibold text-gray-800">Add YouTube Video</h3>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Title *</label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                                placeholder="Video title"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">YouTube URL *</label>
                            <input
                                value={form.youtubeUrl}
                                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                                required
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {VIDEO_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={2}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                            />
                        </div>
                        <button type="submit" disabled={submitting} className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm transition flex items-center gap-2">
                            {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiPlus size={14} />}
                            Add Video
                        </button>
                    </form>
                )}

                {loading ? <Loader /> : videos.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-400">No videos yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {videos.map((video) => (
                            <div key={video._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="aspect-video">
                                    <iframe
                                        src={'https://www.youtube.com/embed/' + video.youtubeId}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="p-4 flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 text-sm truncate">{video.title}</p>
                                        <span className="text-xs text-primary-500 capitalize">{video.category}</span>
                                    </div>
                                    <button onClick={() => handleDelete(video._id)} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg flex items-center justify-center shrink-0 transition">
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ManageVideos;