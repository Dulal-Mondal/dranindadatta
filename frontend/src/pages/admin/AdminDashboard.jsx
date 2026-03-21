import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../../components/common/Loader';
import { getAdminStats } from '../../services/adminService';
import { formatBDT } from '../../utils/formatCurrency';
import { FiUsers, FiCalendar, FiDollarSign, FiUserCheck, FiClock, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await getAdminStats();
            setStats(data.stats);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <AdminLayout><Loader fullScreen /></AdminLayout>;

    const statCards = [
        { label: 'Total Doctors', value: stats?.totalDoctors || 0, icon: <FiUserCheck size={22} />, color: 'bg-blue-50 text-blue-500', to: '/admin/doctors' },
        { label: 'Pending Approval', value: stats?.pendingDoctors || 0, icon: <FiClock size={22} />, color: 'bg-yellow-50 text-yellow-500', to: '/admin/doctors' },
        { label: 'Total Patients', value: stats?.totalPatients || 0, icon: <FiUsers size={22} />, color: 'bg-green-50 text-green-500', to: '/admin/patients' },
        { label: 'Appointments', value: stats?.totalAppointments || 0, icon: <FiCalendar size={22} />, color: 'bg-purple-50 text-purple-500', to: '/admin/doctors' },
        { label: 'Total Revenue', value: formatBDT(stats?.totalRevenue || 0), icon: <FiDollarSign size={22} />, color: 'bg-emerald-50 text-emerald-500', to: '/admin/doctors' },
    ];

    const quickLinks = [
        { label: 'Manage Doctors', icon: '👨‍⚕️', to: '/admin/doctors', desc: 'Approve or reject doctors' },
        { label: 'Manage Patients', icon: '🧑', to: '/admin/patients', desc: 'View and manage patients' },
        { label: 'Manage Slider', icon: '🖼️', to: '/admin/slider', desc: 'Update homepage slider' },
        { label: 'Manage Blogs', icon: '📝', to: '/admin/blogs', desc: 'Create and edit blogs' },
        { label: 'Manage Videos', icon: '🎬', to: '/admin/videos', desc: 'Add YouTube videos' },
        { label: 'Settings', icon: '⚙️', to: '/admin/settings', desc: 'Pixel, Analytics, SSLCommerz' },
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">

                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 text-white">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-1">Manage your telemedicine platform</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {statCards.map((stat) => (
                        <Link key={stat.label} to={stat.to} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col gap-3">
                            <div className={'w-11 h-11 rounded-xl flex items-center justify-center ' + stat.color}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition group flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                                {link.icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 group-hover:text-primary-500 transition">{link.label}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{link.desc}</p>
                            </div>
                            <FiArrowRight size={16} className="text-gray-300 group-hover:text-primary-500 transition" />
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;