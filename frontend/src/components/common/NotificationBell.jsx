import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBell, FiX, FiCheck } from 'react-icons/fi';
import { timeAgo } from '../../utils/formatDate';

const icons = {
    message: '💬',
    appointment: '📅',
    prescription: '💊',
    call: '📞',
};

const getLink = (notif, role) => {
    if (notif.type === 'message') {
        return role === 'doctor' ? '/doctor/messages' : '/patient/messages';
    }
    if (notif.type === 'appointment') {
        return role === 'doctor' ? '/doctor/appointments' : '/patient/appointments';
    }
    if (notif.type === 'prescription') {
        return '/patient/prescriptions';
    }
    return null;
};

const NotificationBell = ({ notifications, unreadCount, markAllRead, markRead, clearAll }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleNotifClick = (notif) => {
        markRead(notif.id);
        setOpen(false);
        const link = getLink(notif, user?.role);
        if (link) navigate(link);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="relative w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition"
            >
                <FiBell size={18} className="text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs text-primary-500 hover:underline flex items-center gap-1">
                                    <FiCheck size={12} /> Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-400 transition">
                                    <FiX size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <FiBell size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotifClick(notif)}
                                    className={'flex items-start gap-3 px-4 py-3 cursor-pointer transition border-b border-gray-50 last:border-0 ' + (!notif.read ? 'bg-primary-50/50' : 'hover:bg-gray-50')}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg shrink-0">
                                        {icons[notif.type] || '🔔'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 leading-tight">{notif.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">{notif.body}</p>
                                        <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
                                    </div>
                                    {!notif.read && (
                                        <div className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-1.5" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;