import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getMessages } from '../../services/messageService';
import MessageBubble from './MessageBubble';
import { FiSend, FiPaperclip } from 'react-icons/fi';

const ChatBox = ({ receiverId, receiverName, receiverAvatar }) => {
    const { user } = useAuth();
    const { socket, isOnline } = useSocket();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [typing, setTyping] = useState(false);
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (!receiverId) return;
        fetchMessages();
    }, [receiverId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', ({ message }) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on('message_sent', ({ message }) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on('user_typing', ({ senderId }) => {
            if (senderId === receiverId) setTyping(true);
        });

        socket.on('user_stop_typing', ({ senderId }) => {
            if (senderId === receiverId) setTyping(false);
        });

        return () => {
            socket.off('receive_message');
            socket.off('message_sent');
            socket.off('user_typing');
            socket.off('user_stop_typing');
        };
    }, [socket, receiverId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data } = await getMessages(receiverId);
            setMessages(data.messages || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = () => {
        if (!text.trim() || !socket) return;
        socket.emit('send_message', {
            senderId: user._id,
            receiverId,
            text: text.trim(),
        });
        socket.emit('stop_typing', { senderId: user._id, receiverId });
        setText('');
    };

    const handleTyping = (e) => {
        setText(e.target.value);
        if (!socket) return;
        socket.emit('typing', { senderId: user._id, receiverId });
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { senderId: user._id, receiverId });
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <div className="relative">
                    <img
                        src={receiverAvatar || 'https://ui-avatars.com/api/?name=' + receiverName + '&background=0ea5e9&color=fff&size=80'}
                        alt={receiverName}
                        className="w-9 h-9 rounded-full object-cover"
                    />
                    {isOnline(receiverId) && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                    )}
                </div>
                <div>
                    <p className="font-medium text-gray-800 text-sm">{receiverName}</p>
                    <p className="text-xs text-gray-400">{isOnline(receiverId) ? 'Online' : 'Offline'}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">No messages yet. Say hello! 👋</p>
                ) : (
                    messages.map((msg, i) => (
                        <MessageBubble key={i} message={msg} isMe={msg.sender?._id === user._id || msg.sender === user._id} />
                    ))
                )}

                {typing && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl px-4 py-3 flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-100 flex items-center gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={handleTyping}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className="w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition"
                >
                    <FiSend size={16} />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;