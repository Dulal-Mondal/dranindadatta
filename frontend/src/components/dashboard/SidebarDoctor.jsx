import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FiHome, FiCalendar, FiUpload,
    FiUser, FiLogOut, FiMessageSquare,
} from 'react-icons/fi';

const SidebarDoctor = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const links = [
        { to: '/doctor/dashboard', icon: <FiHome size={18} />, label: 'Dashboard' },
        { to: '/doctor/appointments', icon: <FiCalendar size={18} />, label: 'Appointments' },
        { to: '/doctor/profile', icon: <FiUser size={18} />, label: 'My Profile' },
        { to: '/doctor/upload', icon: <FiUpload size={18} />, label: 'Upload Media' },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col">
            <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <img
                        src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name + '&background=0ea5e9&color=fff&size=80'}
                        alt={user?.name}
                        className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">Dr. {user?.name}</p>
                        <p className="text-xs text-gray-400">Doctor</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ' + (location.pathname === link.to ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50')}
                    >
                        {link.icon}
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition w-full"
                >
                    <FiLogOut size={18} /> Logout
                </button>
            </div>
        </div>
    );
};

export default SidebarDoctor;