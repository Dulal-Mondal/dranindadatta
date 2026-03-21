import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const useNotification = () => {
    const { socket } = useSocket();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!socket || !user) return;

        socket.on('receive_message', ({ message }) => {
            const senderName = message.sender?.name || 'Someone';
            toast('New message from ' + senderName + ': ' + (message.text || 'Attachment'), {
                icon: '💬',
                duration: 4000,
                style: { fontSize: '13px' },
            });
            addNotification({
                id: Date.now(),
                type: 'message',
                title: 'New message from ' + senderName,
                body: message.text || 'Attachment',
                createdAt: new Date(),
                read: false,
            });
        });

        socket.on('appointment_approved', ({ message }) => {
            toast.success(message || 'Your appointment has been approved!', {
                duration: 5000,
                icon: '✅',
            });
            addNotification({
                id: Date.now(),
                type: 'appointment',
                title: 'Appointment Approved',
                body: message || 'Your appointment has been approved!',
                createdAt: new Date(),
                read: false,
            });
        });

        socket.on('appointment_rejected', ({ message }) => {
            toast.error(message || 'Your appointment has been rejected.', {
                duration: 5000,
            });
            addNotification({
                id: Date.now(),
                type: 'appointment',
                title: 'Appointment Rejected',
                body: message || 'Your appointment has been rejected.',
                createdAt: new Date(),
                read: false,
            });
        });

        socket.on('prescription_ready', ({ message }) => {
            toast.success(message || 'Your prescription is ready!', {
                duration: 5000,
                icon: '💊',
            });
            addNotification({
                id: Date.now(),
                type: 'prescription',
                title: 'Prescription Ready',
                body: message || 'Your prescription is ready!',
                createdAt: new Date(),
                read: false,
            });
        });

        socket.on('incoming_call', ({ callerName }) => {
            toast('Incoming call from ' + callerName, {
                icon: '📞',
                duration: 10000,
                style: {
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    fontSize: '13px',
                },
            });
            addNotification({
                id: Date.now(),
                type: 'call',
                title: 'Incoming Call',
                body: 'Call from ' + callerName,
                createdAt: new Date(),
                read: false,
            });
        });

        return () => {
            socket.off('receive_message');
            socket.off('appointment_approved');
            socket.off('appointment_rejected');
            socket.off('prescription_ready');
            socket.off('incoming_call');
        };
    }, [socket, user]);

    const addNotification = (notification) => {
        setNotifications((prev) => [notification, ...prev].slice(0, 50));
        setUnreadCount((prev) => prev + 1);
    };

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const markRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const clearAll = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return { notifications, unreadCount, markAllRead, markRead, clearAll };
};

export default useNotification; 