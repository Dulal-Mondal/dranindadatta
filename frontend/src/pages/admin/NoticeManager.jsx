import { useState, useEffect } from 'react';
import {
    getAllNotices,
    createNotice,
    updateNotice,
    deleteNotice,
} from '../../services/noticeService';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiToggleLeft, FiToggleRight, FiSave, FiX } from 'react-icons/fi';

const defaultForm = {
    text: '',
    color: '#0ea5e9',
    bgColor: '#eff6ff',
    order: 0,
};

const NoticeManager = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(defaultForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const { data } = await getAllNotices();
            setNotices(data.notices || []);
        } catch {
            toast.error('Failed to load notices');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.text.trim()) {
            toast.error('Notice text is required');
            return;
        }

        try {
            if (editingId) {
                const { data } = await updateNotice(editingId, form);
                setNotices((prev) =>
                    prev.map((n) => (n._id === editingId ? data.notice : n))
                );
                toast.success('Notice updated');
            } else {
                const { data } = await createNotice(form);
                setNotices((prev) => [data.notice, ...prev]);
                toast.success('Notice created');
            }
            resetForm();
        } catch {
            toast.error('Something went wrong');
        }
    };

    const handleEdit = (notice) => {
        setForm({
            text: notice.text,
            color: notice.color,
            bgColor: notice.bgColor,
            order: notice.order,
        });
        setEditingId(notice._id);
        setShowForm(true);
    };

    const handleToggle = async (notice) => {
        try {
            const { data } = await updateNotice(notice._id, { isActive: !notice.isActive });
            setNotices((prev) =>
                prev.map((n) => (n._id === notice._id ? data.notice : n))
            );
            toast.success(data.notice.isActive ? 'Notice activated' : 'Notice deactivated');
        } catch {
            toast.error('Toggle failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this notice?')) return;
        try {
            await deleteNotice(id);
            setNotices((prev) => prev.filter((n) => n._id !== id));
            toast.success('Notice deleted');
        } catch {
            toast.error('Delete failed');
        }
    };

    const resetForm = () => {
        setForm(defaultForm);
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Notice Bar Manager</h2>
                    <p className="text-sm text-gray-500 mt-1">Navbar এর নিচে scrolling notice manage করো</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2.5 rounded-xl transition"
                >
                    <FiPlus size={18} /> Add Notice
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-4">
                        {editingId ? 'Edit Notice' : 'New Notice'}
                    </h3>

                    <div className="space-y-4">
                        {/* Text */}
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Notice Text *</label>
                            <input
                                type="text"
                                placeholder="e.g. New doctors added! Book your appointment today."
                                value={form.text}
                                onChange={(e) => setForm({ ...form, text: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Text Color */}
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Text Color</label>
                                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
                                    <input
                                        type="color"
                                        value={form.color}
                                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                                        className="w-8 h-8 rounded cursor-pointer border-0"
                                    />
                                    <span className="text-sm text-gray-600">{form.color}</span>
                                </div>
                            </div>

                            {/* Background Color */}
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Background Color</label>
                                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
                                    <input
                                        type="color"
                                        value={form.bgColor}
                                        onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                                        className="w-8 h-8 rounded cursor-pointer border-0"
                                    />
                                    <span className="text-sm text-gray-600">{form.bgColor}</span>
                                </div>
                            </div>

                            {/* Order */}
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Order</label>
                                <input
                                    type="number"
                                    value={form.order}
                                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Preview</label>
                            <div
                                className="w-full overflow-hidden py-2 rounded-xl border"
                                style={{ backgroundColor: form.bgColor, borderColor: form.color + '44' }}
                            >
                                <p className="text-sm font-medium text-center" style={{ color: form.color }}>
                                    {form.text || 'Notice text will appear here...'}
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium px-5 py-2.5 rounded-xl transition"
                            >
                                <FiSave size={16} /> {editingId ? 'Update' : 'Create'}
                            </button>
                            <button
                                onClick={resetForm}
                                className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium px-5 py-2.5 rounded-xl transition"
                            >
                                <FiX size={16} /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notice List */}
            {loading ? (
                <div className="text-center py-16 text-gray-400">Loading...</div>
            ) : notices.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <p className="text-4xl mb-3">📢</p>
                    <p className="text-gray-500 font-medium">No notices yet</p>
                    <p className="text-gray-400 text-sm mt-1">Add a notice to show in the scrolling bar</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notices.map((notice) => (
                        <div
                            key={notice._id}
                            className={'bg-white rounded-2xl border p-4 flex items-center gap-4 transition ' + (notice.isActive ? 'border-gray-100 shadow-sm' : 'border-gray-100 opacity-50')}
                        >
                            {/* Color indicator */}
                            <div
                                className="w-3 h-10 rounded-full shrink-0"
                                style={{ backgroundColor: notice.color }}
                            />

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate">{notice.text}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span
                                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                                        style={{ backgroundColor: notice.bgColor, color: notice.color }}
                                    >
                                        {notice.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="text-xs text-gray-400">Order: {notice.order}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                {/* Toggle */}
                                <button
                                    onClick={() => handleToggle(notice)}
                                    className={'p-2 rounded-xl transition ' + (notice.isActive ? 'text-green-500 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100')}
                                    title={notice.isActive ? 'Deactivate' : 'Activate'}
                                >
                                    {notice.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                                </button>

                                {/* Edit */}
                                <button
                                    onClick={() => handleEdit(notice)}
                                    className="p-2 rounded-xl text-blue-500 bg-blue-50 hover:bg-blue-100 transition"
                                    title="Edit"
                                >
                                    <FiEdit2 size={16} />
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={() => handleDelete(notice._id)}
                                    className="p-2 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 transition"
                                    title="Delete"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NoticeManager;