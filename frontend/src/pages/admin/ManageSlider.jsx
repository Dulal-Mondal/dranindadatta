import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../../components/common/Loader';
import { getSliders, createSlider, updateSlider, deleteSlider } from '../../services/adminService';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave } from 'react-icons/fi';

const ManageSlider = () => {
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        title: '',
        subtitle: '',
        buttonText: 'Learn More',
        buttonLink: '/',
        order: 0,
        image: null,
    });

    useEffect(() => {
        fetchSliders();
    }, []);

    const fetchSliders = async () => {
        try {
            const { data } = await getSliders();
            setSliders(data.sliders || []);
        } catch (err) {
            toast.error('Failed to load sliders');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm({ ...form, image: file });
        setPreview(URL.createObjectURL(file));
    };

    const resetForm = () => {
        setForm({ title: '', subtitle: '', buttonText: 'Learn More', buttonLink: '/', order: 0, image: null });
        setPreview(null);
        setEditId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editId && !form.image) return toast.error('Please select an image');
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('subtitle', form.subtitle);
            formData.append('buttonText', form.buttonText);
            formData.append('buttonLink', form.buttonLink);
            formData.append('order', form.order);
            if (form.image) formData.append('image', form.image);

            if (editId) {
                await updateSlider(editId, formData);
                toast.success('Slider updated!');
            } else {
                await createSlider(formData);
                toast.success('Slider created!');
            }
            resetForm();
            fetchSliders();
        } catch (err) {
            toast.error('Failed to save slider');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (slider) => {
        setForm({
            title: slider.title,
            subtitle: slider.subtitle || '',
            buttonText: slider.buttonText || 'Learn More',
            buttonLink: slider.buttonLink || '/',
            order: slider.order || 0,
            image: null,
        });
        setPreview(slider.imageUrl);
        setEditId(slider._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this slider?')) return;
        try {
            await deleteSlider(id);
            toast.success('Slider deleted');
            fetchSliders();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Slider</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm transition"
                    >
                        {showForm ? <><FiX size={16} /> Cancel</> : <><FiPlus size={16} /> Add Slider</>}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 mb-6 space-y-4">
                        <h3 className="font-semibold text-gray-800">{editId ? 'Edit Slider' : 'New Slider'}</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Title *</label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                    placeholder="Slider title"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Subtitle</label>
                                <input
                                    value={form.subtitle}
                                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                                    placeholder="Optional subtitle"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Button Text</label>
                                <input
                                    value={form.buttonText}
                                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Button Link</label>
                                <input
                                    value={form.buttonLink}
                                    onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Order</label>
                                <input
                                    type="number"
                                    value={form.order}
                                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Image {!editId && '*'}</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                            {preview && (
                                <img src={preview} alt="preview" className="mt-3 rounded-xl h-40 object-cover" />
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm transition"
                        >
                            {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={14} />}
                            {editId ? 'Update Slider' : 'Create Slider'}
                        </button>
                    </form>
                )}

                {loading ? <Loader /> : sliders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-400">No sliders yet. Add your first one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {sliders.map((slider) => (
                            <div key={slider._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="relative h-40">
                                    <img src={slider.imageUrl} alt={slider.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <p className="font-semibold text-sm">{slider.title}</p>
                                        {slider.subtitle && <p className="text-xs text-white/70">{slider.subtitle}</p>}
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="text-xs text-gray-500">
                                        Order: {slider.order} · Button: "{slider.buttonText}"
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(slider)} className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center transition">
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(slider._id)} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg flex items-center justify-center transition">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ManageSlider;