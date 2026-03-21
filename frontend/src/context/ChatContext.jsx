import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { getConversations } from '../services/messageService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { socket } = useSocket();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', ({ message, conversationId }) => {
            setMessages((prev) => [...prev, message]);
            setUnreadCount((prev) => prev + 1);
            fetchConversations();
        });

        return () => socket.off('receive_message');
    }, [socket]);

    const fetchConversations = async () => {
        try {
            const { data } = await getConversations();
            setConversations(data.conversations);
            const total = data.conversations.reduce((acc, c) => {
                const count = c.unreadCount?.get?.(localStorage.getItem('userId')) || 0;
                return acc + count;
            }, 0);
            setUnreadCount(total);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                conversations,
                activeChat,
                setActiveChat,
                messages,
                setMessages,
                unreadCount,
                fetchConversations,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);