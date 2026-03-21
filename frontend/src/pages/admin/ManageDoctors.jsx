import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../../components/common/Loader';
import { getAllDoctorsAdmin, approveDoctor, rejectDoctor, blockUser, unblockUser, deleteUser } from '../../services/adminService';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiTrash2, FiSearch } from 'react-icons/fi';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, [filter]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const { data } = await getAllDoctorsAdmin(params);
            setDoctors(data.doctors || []);
        } catch (err) {
            toast.error('Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveDoctor(id);
            toast.success('Doctor approved');
            fetchDoctors();
        } catch (err) {
            toast.error('Failed');
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectDoctor(id);
            toast.success('Doctor rejected');
            fetchDoctors();
        } catch (err) {
            toast.error('Failed');
        }
    };

    const handleBlock = async (id, isActive) => {
        try {
            if (isActive) {
                await blockUser(id);
                toast.success('Doctor blocked');
            } else {
                await unblockUser(id);
                toast.success('Doctor unblocked');
            }
            fetchDoctors();
        } catch (err) {
            toast.error('Failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this doctor permanently?')) return;
        try {
            await deleteUser(id);
            toast.success('Doctor deleted');
            fetchDoctors();
        } catch (err) {
            toast.error('Failed');
        }
    };

    const filtered = doctors.filter((d) =>
        d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.user?.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Doctors</h1>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={'px-4 py-2.5 rounded-xl text-sm font-medium transition capitalize ' + (filter === s ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300')}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <Loader />
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-400">No doctors found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Doctor</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Specialization</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Fee</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Status</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map((doctor) => (
                                        <tr key={doctor._id} className="hover:bg-gray-50 transition">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={doctor.user?.avatar || 'https://ui-avatars.com/api/?name=' + doctor.user?.name + '&background=0ea5e9&color=fff&size=80'}
                                                        alt={doctor.user?.name}
                                                        className="w-10 h-10 rounded-xl object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm">Dr. {doctor.user?.name}</p>
                                                        <p className="text-xs text-gray-400">{doctor.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-600">{doctor.specialization}</td>
                                            <td className="px-5 py-4 text-sm text-gray-600">৳{doctor.consultationFee}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={'text-xs px-2.5 py-1 rounded-full font-medium w-fit ' + (doctor.isApproved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600')}>
                                                        {doctor.isApproved ? 'Approved' : 'Pending'}
                                                    </span>
                                                    <span className={'text-xs px-2.5 py-1 rounded-full font-medium w-fit ' + (doctor.user?.isActive ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600')}>
                                                        {doctor.user?.isActive ? 'Active' : 'Blocked'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    {!doctor.isApproved && (
                                                        <button onClick={() => handleApprove(doctor.user?._id)} className="w-8 h-8 bg-green-50 hover:bg-green-100 text-green-500 rounded-lg flex items-center justify-center transition" title="Approve">
                                                            <FiCheck size={15} />
                                                        </button>
                                                    )}
                                                    {doctor.isApproved && (
                                                        <button onClick={() => handleReject(doctor.user?._id)} className="w-8 h-8 bg-yellow-50 hover:bg-yellow-100 text-yellow-500 rounded-lg flex items-center justify-center transition" title="Revoke">
                                                            <FiX size={15} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleBlock(doctor.user?._id, doctor.user?.isActive)}
                                                        className={'w-8 h-8 rounded-lg flex items-center justify-center transition ' + (doctor.user?.isActive ? 'bg-red-50 hover:bg-red-100 text-red-400' : 'bg-green-50 hover:bg-green-100 text-green-500')}
                                                        title={doctor.user?.isActive ? 'Block' : 'Unblock'}
                                                    >
                                                        {doctor.user?.isActive ? <FiX size={15} /> : <FiCheck size={15} />}
                                                    </button>
                                                    <button onClick={() => handleDelete(doctor.user?._id)} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg flex items-center justify-center transition" title="Delete">
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ManageDoctors;