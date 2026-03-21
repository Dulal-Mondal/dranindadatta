import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FiHome, FiUsers, FiUserCheck, FiImage,
    FiFileText, FiVideo, FiLogOut, FiSettings,
} from 'react-icons/fi';

const SidebarAdmin = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const links = [
        { to: '/admin/dashboard', icon: <FiHome size={18} />, label: 'Dashboard' },
        { to: '/admin/doctors', icon: <FiUserCheck size={18} />, label: 'Doctors' },
        { to: '/admin/patients', icon: <FiUsers size={18} />, label: 'Patients' },
        { to: '/admin/slider', icon: <FiImage size={18} />, label: 'Slider' },
        { to: '/admin/blogs', icon: <FiFileText size={18} />, label: 'Blogs' },
        { to: '/admin/videos', icon: <FiVideo size={18} />, label: 'Videos' },
        { to: '/admin/settings', icon: <FiSettings size={18} />, label: 'Settings' }, // ✅ নতুন
    ];

    return (
        <div className="w-64 bg-gray-900 text-gray-300 min-h-screen flex flex-col">
            <div className="p-5 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold">
                        A
                    </div>
                    <div>
                        <p className="font-semibold text-white text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ' + (location.pathname === link.to ? 'bg-primary-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white')}
                    >
                        {link.icon}
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-gray-800 transition w-full"
                >
                    <FiLogOut size={18} /> Logout
                </button>
            </div>
        </div>
    );
};

export default SidebarAdmin;