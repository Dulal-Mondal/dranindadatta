import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../../components/common/Loader';
import { getAllUsers, blockUser, unblockUser, deleteUser } from '../../services/adminService';
import toast from 'react-hot-toast';
import { FiSearch, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '../../utils/formatDate';

const ManagePatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const { data } = await getAllUsers({ role: 'patient' });
            setPatients(data.users || []);
        } catch (err) {
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    const handleBlock = async (id, isActive) => {
        try {
            if (isActive) { await blockUser(id); toast.success('Patient blocked'); }
            else { await unblockUser(id); toast.success('Patient unblocked'); }
            fetchPatients();
        } catch (err) { toast.error('Failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this patient?')) return;
        try {
            await deleteUser(id);
            toast.success('Patient deleted');
            fetchPatients();
        } catch (err) { toast.error('Failed'); }
    };

    const filtered = patients.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Patients</h1>
                <div className="relative mb-6">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    />
                </div>

                {loading ? <Loader /> : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Patient</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Phone</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Joined</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Status</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map((patient) => (
                                        <tr key={patient._id} className="hover:bg-gray-50 transition">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={patient.avatar || 'https://ui-avatars.com/api/?name=' + patient.name + '&background=6366f1&color=fff&size=80'}
                                                        alt={patient.name}
                                                        className="w-9 h-9 rounded-xl object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm">{patient.name}</p>
                                                        <p className="text-xs text-gray-400">{patient.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-600">{patient.phone || '—'}</td>
                                            <td className="px-5 py-4 text-sm text-gray-600">{formatDate(patient.createdAt)}</td>
                                            <td className="px-5 py-4">
                                                <span className={'text-xs px-2.5 py-1 rounded-full font-medium ' + (patient.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')}>
                                                    {patient.isActive ? 'Active' : 'Blocked'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleBlock(patient._id, patient.isActive)}
                                                        className={'w-8 h-8 rounded-lg flex items-center justify-center transition ' + (patient.isActive ? 'bg-red-50 hover:bg-red-100 text-red-400' : 'bg-green-50 hover:bg-green-100 text-green-500')}
                                                    >
                                                        {patient.isActive ? <FiX size={14} /> : <FiCheck size={14} />}
                                                    </button>
                                                    <button onClick={() => handleDelete(patient._id)} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg flex items-center justify-center transition">
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

export default ManagePatients;