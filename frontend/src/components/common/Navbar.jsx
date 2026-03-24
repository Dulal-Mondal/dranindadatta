// import { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import toast from 'react-hot-toast';
// import {
//     FiMenu, FiX, FiUser, FiLogOut, FiSettings,
//     FiCalendar, FiMessageSquare, FiFileText,
// } from 'react-icons/fi';

// const Navbar = () => {
//     const { user, logout } = useAuth();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [dropdownOpen, setDropdownOpen] = useState(false);

//     const handleLogout = () => {
//         logout();
//         toast.success('Logged out successfully');
//         navigate('/');
//     };

//     const getDashboardLink = () => {
//         if (user?.role === 'doctor') return '/doctor/dashboard';
//         if (user?.role === 'admin') return '/admin/dashboard';
//         return '/patient/dashboard';
//     };

//     const navLinks = [
//         { label: 'Home', to: '/' },
//         { label: 'Doctors', to: '/doctors' },
//         { label: 'Blogs', to: '/blogs' },
//         { label: 'Videos', to: '/videos' },
//     ];

//     const isActive = (path) => location.pathname === path;

//     return (
//         <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center justify-between h-16">

//                     {/* Logo */}
//                     <Link to="/" className="flex items-center gap-2">
//                         <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
//                             <span className="text-white text-lg">🏥</span>
//                         </div>
//                         <span className="text-xl font-bold text-gray-800">
//                             Dr.<span className="text-primary-500">AnindaDatta</span>
//                         </span>
//                     </Link>

//                     {/* Desktop nav links */}
//                     <div className="hidden md:flex items-center gap-1">
//                         {navLinks.map((link) => (
//                             <Link
//                                 key={link.to}
//                                 to={link.to}
//                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition
//                   ${isActive(link.to)
//                                         ? 'bg-primary-50 text-primary-600'
//                                         : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
//                                     }`}
//                             >
//                                 {link.label}
//                             </Link>
//                         ))}
//                     </div>

//                     {/* Right side */}
//                     <div className="hidden md:flex items-center gap-3">
//                         {user ? (
//                             <div className="relative">
//                                 <button
//                                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                                     className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition"
//                                 >
//                                     <img
//                                         src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0ea5e9&color=fff`}
//                                         alt={user.name}
//                                         className="w-8 h-8 rounded-full object-cover"
//                                     />
//                                     <div className="text-left">
//                                         <p className="text-sm font-medium text-gray-800 leading-none">{user.name}</p>
//                                         <p className="text-xs text-gray-500 capitalize">{user.role}</p>
//                                     </div>
//                                 </button>

//                                 {/* Dropdown */}
//                                 {dropdownOpen && (
//                                     <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
//                                         <Link
//                                             to={getDashboardLink()}
//                                             onClick={() => setDropdownOpen(false)}
//                                             className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                                         >
//                                             <FiUser size={15} /> Dashboard
//                                         </Link>

//                                         {user.role === 'patient' && (
//                                             <>
//                                                 <Link
//                                                     to="/patient/appointments"
//                                                     onClick={() => setDropdownOpen(false)}
//                                                     className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                                                 >
//                                                     <FiCalendar size={15} /> My Appointments
//                                                 </Link>
//                                                 <Link
//                                                     to="/patient/prescriptions"
//                                                     onClick={() => setDropdownOpen(false)}
//                                                     className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                                                 >
//                                                     <FiFileText size={15} /> Prescriptions
//                                                 </Link>
//                                             </>
//                                         )}

//                                         {user.role === 'doctor' && (
//                                             <>
//                                                 <Link
//                                                     to="/doctor/appointments"
//                                                     onClick={() => setDropdownOpen(false)}
//                                                     className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                                                 >
//                                                     <FiCalendar size={15} /> Appointments
//                                                 </Link>
//                                                 <Link
//                                                     to="/doctor/profile"
//                                                     onClick={() => setDropdownOpen(false)}
//                                                     className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                                                 >
//                                                     <FiSettings size={15} /> My Profile
//                                                 </Link>
//                                             </>
//                                         )}

//                                         <div className="border-t border-gray-100 mt-1 pt-1">
//                                             <button
//                                                 onClick={() => { handleLogout(); setDropdownOpen(false); }}
//                                                 className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full"
//                                             >
//                                                 <FiLogOut size={15} /> Logout
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             <div className="flex items-center gap-2">
//                                 <Link to="/login" className="btn-outline py-2 px-4 text-sm">
//                                     Sign In
//                                 </Link>
//                                 <Link to="/register" className="btn-primary py-2 px-4 text-sm">
//                                     Get Started
//                                 </Link>
//                             </div>
//                         )}
//                     </div>

//                     {/* Mobile menu button */}
//                     <button
//                         onClick={() => setMenuOpen(!menuOpen)}
//                         className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
//                     >
//                         {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
//                     </button>
//                 </div>
//             </div>

//             {/* Mobile menu */}
//             {menuOpen && (
//                 <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
//                     {navLinks.map((link) => (
//                         <Link
//                             key={link.to}
//                             to={link.to}
//                             onClick={() => setMenuOpen(false)}
//                             className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition
//                 ${isActive(link.to)
//                                     ? 'bg-primary-50 text-primary-600'
//                                     : 'text-gray-600 hover:bg-gray-50'
//                                 }`}
//                         >
//                             {link.label}
//                         </Link>
//                     ))}

//                     {user ? (
//                         <>
//                             <Link
//                                 to={getDashboardLink()}
//                                 onClick={() => setMenuOpen(false)}
//                                 className="block px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
//                             >
//                                 Dashboard
//                             </Link>
//                             <button
//                                 onClick={() => { handleLogout(); setMenuOpen(false); }}
//                                 className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50"
//                             >
//                                 Logout
//                             </button>
//                         </>
//                     ) : (
//                         <div className="flex gap-2 pt-2">
//                             <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline flex-1 text-center text-sm py-2">
//                                 Sign In
//                             </Link>
//                             <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center text-sm py-2">
//                                 Get Started
//                             </Link>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </nav>
//     );
// };

// export default Navbar;


import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
    FiMenu, FiX, FiUser, FiLogOut, FiSettings,
    FiCalendar, FiMessageSquare, FiFileText,
} from 'react-icons/fi';
import NotificationBell from '../common/NotificationBell';
import useNotification from '../../hooks/useNotification';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const { notifications, unreadCount, markAllRead, markRead, clearAll } = useNotification();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    const getDashboardLink = () => {
        if (user?.role === 'doctor') return '/doctor/dashboard';
        if (user?.role === 'admin') return '/admin/dashboard';
        return '/patient/dashboard';
    };

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Doctors', to: '/doctors' },
        { label: 'Blogs', to: '/blogs' },
        { label: 'Videos', to: '/videos' },
        { label: 'Sevices', to: '/' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">

                        </div><img src="" alt="" />
                        {/* <span className="text-xl font-bold text-gray-800">
                            Dr.<span className="text-primary-500">AnindaDatta</span>
                        </span> */}
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={'px-4 py-2 rounded-lg text-sm font-medium transition ' + (isActive(link.to) ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50')}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                <NotificationBell
                                    notifications={notifications}
                                    unreadCount={unreadCount}
                                    markAllRead={markAllRead}
                                    markRead={markRead}
                                    clearAll={clearAll}
                                />

                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition"
                                    >
                                        <img
                                            src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.name + '&background=0ea5e9&color=fff'}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-gray-800 leading-none">{user.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                            <Link
                                                to={getDashboardLink()}
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <FiUser size={15} /> Dashboard
                                            </Link>

                                            {user.role === 'patient' && (
                                                <>
                                                    <Link to="/patient/appointments" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                        <FiCalendar size={15} /> My Appointments
                                                    </Link>
                                                    <Link to="/patient/messages" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                        <FiMessageSquare size={15} /> Messages
                                                    </Link>
                                                    <Link to="/patient/prescriptions" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                        <FiFileText size={15} /> Prescriptions
                                                    </Link>
                                                </>
                                            )}

                                            {user.role === 'doctor' && (
                                                <>
                                                    <Link to="/doctor/appointments" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                        <FiCalendar size={15} /> Appointments
                                                    </Link>
                                                    <Link to="/doctor/messages" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                        <FiMessageSquare size={15} /> Messages
                                                    </Link>
                                                    <Link to="/doctor/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                        <FiSettings size={15} /> My Profile
                                                    </Link>
                                                </>
                                            )}

                                            <div className="border-t border-gray-100 mt-1 pt-1">
                                                <button
                                                    onClick={() => { handleLogout(); setDropdownOpen(false); }}
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full"
                                                >
                                                    <FiLogOut size={15} /> Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="border border-primary-500 text-primary-500 hover:bg-primary-50 font-medium py-2 px-4 rounded-lg transition text-sm">
                                    Sign In
                                </Link>
                                <Link to="/register" className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition text-sm">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className={'block px-4 py-2.5 rounded-lg text-sm font-medium transition ' + (isActive(link.to) ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50')}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {user ? (
                        <>
                            <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Dashboard</Link>
                            {user.role === 'patient' && (
                                <Link to="/patient/messages" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Messages</Link>
                            )}
                            {user.role === 'doctor' && (
                                <Link to="/doctor/messages" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Messages</Link>
                            )}
                            <button
                                onClick={() => { handleLogout(); setMenuOpen(false); }}
                                className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2 pt-2">
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center border border-primary-500 text-primary-500 text-sm py-2 rounded-lg">Sign In</Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center bg-primary-500 text-white text-sm py-2 rounded-lg">Get Started</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;