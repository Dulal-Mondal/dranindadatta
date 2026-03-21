import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (!user) return;

        const newSocket = io(
            import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
            { transports: ['websocket'] }
        );

        newSocket.on('connect', () => {
            newSocket.emit('user_online', user._id);
        });

        newSocket.on('online_users', (users) => {
            setOnlineUsers(users);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const isOnline = (userId) => onlineUsers.includes(userId);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, isOnline }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);