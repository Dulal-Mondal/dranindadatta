import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { getMyDoctorProfile, updateDoctorProfile } from '../../services/doctorService';
import { uploadAvatar } from '../../services/uploadService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiPlus, FiX, FiCamera } from 'react-icons/fi';
import { SPECIALIZATIONS } from '../../utils/constants';

const DoctorProfile = () => {
    const { user, setUser } = useAuth();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [qualInput, setQualInput] = useState('');
    const [avatarLoading, setAvatarLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        phone: '',
        specialization: '',
        experience: '',
        consultationFee: '',
        bio: '',
        qualifications: [],
        availableSlots: [],
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await getMyDoctorProfile();
            const d = data.doctor;
            setDoctor(d);
            setForm({
                name: d.user?.name || '',
                phone: d.user?.phone || '',
                specialization: d.specialization || '',
                experience: d.experience || '',
                consultationFee: d.consultationFee || '',
                bio: d.bio || '',
                qualifications: d.qualifications || [],
                availableSlots: d.availableSlots || [],
            });
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDoctorProfile(form);
            toast.success('Profile updated!');
            setEditing(false);
            fetchProfile();
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        setAvatarLoading(true);
        try {
            const { data } = await uploadAvatar(formData);
            setUser({ ...user, avatar: data.avatarUrl });
            toast.success('Avatar updated!');
        } catch (err) {
            toast.error('Failed to upload avatar');
        } finally {
            setAvatarLoading(false);
        }
    };

    const addQualification = () => {
        if (!qualInput.trim()) return;
        setForm({ ...form, qualifications: [...form.qualifications, qualInput.trim()] });
        setQualInput('');
    };

    const removeQualification = (i) => {
        setForm({ ...form, qualifications: form.qualifications.filter((_, idx) => idx !== i) });
    };

    const addSlot = () => {
        setForm({
            ...form,
            availableSlots: [...form.availableSlots, { day: 'Monday', startTime: '09:00', endTime: '17:00' }],
        });
    };

    const removeSlot = (i) => {
        setForm({ ...form, availableSlots: form.availableSlots.filter((_, idx) => idx !== i) });
    };

    const updateSlot = (i, field, value) => {
        const updated = [...form.availableSlots];
        updated[i][field] = value;
        setForm({ ...form, availableSlots: updated });
    };

    if (loading) return <><Navbar /><Loader fullScreen /></>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                    {!editing ? (
                        <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm transition">
                            <FiEdit2 size={14} /> Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => setEditing(false)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm transition">
                                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={14} />}
                                Save
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-5">
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <img
                                    src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name + '&background=0ea5e9&color=fff&size=120'}
                                    alt={user?.name}
                                    className="w-20 h-20 rounded-2xl object-cover"
                                />
                                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition">
                                    {avatarLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCamera size={14} className="text-white" />}
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                </label>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-lg">Dr. {user?.name}</p>
                                <p className="text-primary-500 text-sm">{doctor?.specialization}</p>
                                <p className="text-gray-400 text-xs mt-0.5">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-800 mb-4">Basic Info</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    disabled={!editing}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
                                <input
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    disabled={!editing}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Specialization</label>
                                <select
                                    value={form.specialization}
                                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                                    disabled={!editing}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                >
                                    {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Experience (years)</label>
                                <input
                                    type="number"
                                    value={form.experience}
                                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                    disabled={!editing}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Consultation Fee (BDT)</label>
                                <input
                                    type="number"
                                    value={form.consultationFee}
                                    onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
                                    disabled={!editing}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Bio</label>
                            <textarea
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                disabled={!editing}
                                rows={3}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-800 mb-4">Qualifications</h3>
                        {editing && (
                            <div className="flex gap-2 mb-3">
                                <input
                                    value={qualInput}
                                    onChange={(e) => setQualInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
                                    placeholder="e.g. MBBS, MD"
                                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <button onClick={addQualification} className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-600">
                                    Add
                                </button>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {form.qualifications.map((q, i) => (
                                <span key={i} className="flex items-center gap-1.5 bg-primary-50 text-primary-600 text-sm px-3 py-1 rounded-full">
                                    {q}
                                    {editing && (
                                        <button onClick={() => removeQualification(i)} className="hover:text-red-500">
                                            <FiX size={12} />
                                        </button>
                                    )}
                                </span>
                            ))}
                            {form.qualifications.length === 0 && <p className="text-gray-400 text-sm">No qualifications added</p>}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">Available Slots</h3>
                            {editing && (
                                <button onClick={addSlot} className="flex items-center gap-1 text-primary-500 text-sm font-medium">
                                    <FiPlus size={16} /> Add Slot
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {form.availableSlots.map((slot, i) => (
                                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                                    <select
                                        value={slot.day}
                                        onChange={(e) => updateSlot(i, 'day', e.target.value)}
                                        disabled={!editing}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-white"
                                    >
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <input type="time" value={slot.startTime} onChange={(e) => updateSlot(i, 'startTime', e.target.value)} disabled={!editing}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-white" />
                                    <span className="text-gray-400 text-sm">to</span>
                                    <input type="time" value={slot.endTime} onChange={(e) => updateSlot(i, 'endTime', e.target.value)} disabled={!editing}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-white" />
                                    {editing && (
                                        <button onClick={() => removeSlot(i)} className="text-red-400 hover:text-red-500 ml-auto">
                                            <FiX size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {form.availableSlots.length === 0 && <p className="text-gray-400 text-sm">No slots added</p>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DoctorProfile;