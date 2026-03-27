import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getMessages, editMessage } from '../../services/messageService';
import { getDoctorById } from '../../services/doctorService';
import { formatTime } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { FiSend, FiArrowLeft, FiEdit2, FiCheck, FiX, FiCornerUpLeft } from 'react-icons/fi';

const PatientChat = () => {
    const { doctorId } = useParams();
    const { user } = useAuth();
    const { socket, isOnline } = useSocket();

    const [doctor, setDoctor] = useState(null);
    const [doctorUserId, setDoctorUserId] = useState(null); // ✅ নতুন
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [typing, setTyping] = useState(false);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [replyTo, setReplyTo] = useState(null);

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const editInputRef = useRef(null);
    const inputRef = useRef(null);

    // ✅ doctor আগে fetch করো, তারপর doctor.user._id দিয়ে messages fetch করো
    useEffect(() => {
        const fetchDoctorAndMessages = async () => {
            try {
                const { data } = await getDoctorById(doctorId);
                const fetchedDoctor = data.doctor;
                setDoctor(fetchedDoctor);

                const userId = fetchedDoctor.user._id;
                setDoctorUserId(userId);

                const msgRes = await getMessages(userId);
                setMessages(msgRes.data.messages || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorAndMessages();
    }, [doctorId]);

    useEffect(() => {
        if (!socket) return;
        socket.on('receive_message', ({ message }) => setMessages((prev) => [...prev, message]));
        socket.on('message_sent', ({ message }) => setMessages((prev) => [...prev, message]));
        socket.on('user_typing', ({ senderId }) => { if (senderId === doctorUserId) setTyping(true); });
        socket.on('user_stop_typing', ({ senderId }) => { if (senderId === doctorUserId) setTyping(false); });
        return () => {
            socket.off('receive_message');
            socket.off('message_sent');
            socket.off('user_typing');
            socket.off('user_stop_typing');
        };
    }, [socket, doctorUserId]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    useEffect(() => { if (editingId && editInputRef.current) editInputRef.current.focus(); }, [editingId]);
    useEffect(() => { if (replyTo && inputRef.current) inputRef.current.focus(); }, [replyTo]);

    const handleSend = () => {
        if (!text.trim() || !socket || !doctorUserId) return;
        socket.emit('send_message', {
            senderId: user._id,
            receiverId: doctorUserId, // ✅ doctor.user._id পাঠাচ্ছি
            text: text.trim(),
            replyTo: replyTo?._id || null,
        });
        socket.emit('stop_typing', { senderId: user._id, receiverId: doctorUserId });
        setText('');
        setReplyTo(null);
    };

    const handleTyping = (e) => {
        setText(e.target.value);
        if (!socket || !doctorUserId) return;
        socket.emit('typing', { senderId: user._id, receiverId: doctorUserId });
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { senderId: user._id, receiverId: doctorUserId });
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
        if (e.key === 'Escape') setReplyTo(null);
    };

    const startEdit = (msg) => { setEditingId(msg._id); setEditText(msg.text); };
    const cancelEdit = () => { setEditingId(null); setEditText(''); };

    const saveEdit = async (messageId) => {
        if (!editText.trim()) return;
        try {
            await editMessage(messageId, editText.trim());
            setMessages((prev) =>
                prev.map((m) => (m._id === messageId ? { ...m, text: editText.trim(), isEdited: true } : m))
            );
            cancelEdit();
            toast.success('Message updated');
        } catch (err) { toast.error('Failed to edit'); }
    };

    const handleReply = (msg) => {
        setReplyTo(msg);
        inputRef.current?.focus();
    };

    const getReplyPreview = (msg) => {
        if (!msg?.replyTo) return null;
        const replied = typeof msg.replyTo === 'object' ? msg.replyTo : messages.find((m) => m._id === msg.replyTo);
        return replied;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>

                {/* Header */}
                <div className="bg-white rounded-t-xl border border-gray-100 p-4 flex items-center gap-3">
                    <Link to="/patient/messages" className="text-gray-400 hover:text-gray-600"><FiArrowLeft size={20} /></Link>
                    <div className="relative">
                        <img
                            src={doctor?.user?.avatar || 'https://ui-avatars.com/api/?name=' + (doctor?.user?.name || 'D') + '&background=0ea5e9&color=fff&size=80'}
                            className="w-10 h-10 rounded-full object-cover"
                            alt="doctor"
                        />
                        {isOnline(doctorUserId) && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">Dr. {doctor?.user?.name}</p>
                        <p className="text-xs text-gray-500">{isOnline(doctorUserId) ? 'Online' : 'Offline'}</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 bg-white border-x border-gray-100 overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : messages.length === 0 ? (
                        <p className="text-center py-10 text-gray-400 text-sm">No messages yet. Say hello! 👋</p>
                    ) : (
                        messages.map((msg, i) => {
                            const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                            const isEditing = editingId === msg._id;
                            const replied = getReplyPreview(msg);

                            return (
                                <div key={i} className={'flex ' + (isMe ? 'justify-end' : 'justify-start')}>
                                    <div className={'group flex flex-col max-w-xs lg:max-w-md ' + (isMe ? 'items-end' : 'items-start')}>

                                        {replied && (
                                            <div className={'mb-1 px-3 py-1.5 rounded-xl border-l-4 text-xs max-w-full ' + (isMe ? 'bg-primary-100 border-primary-300 text-primary-700' : 'bg-gray-100 border-gray-300 text-gray-600')}>
                                                <p className="font-semibold mb-0.5">
                                                    {replied.sender?.name === user.name ? 'You' : replied.sender?.name || 'Unknown'}
                                                </p>
                                                <p className="truncate">{replied.text}</p>
                                            </div>
                                        )}

                                        {isEditing ? (
                                            <div className="flex items-center gap-2 bg-white border border-primary-300 rounded-2xl px-3 py-2 shadow-sm">
                                                <input
                                                    ref={editInputRef}
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveEdit(msg._id);
                                                        if (e.key === 'Escape') cancelEdit();
                                                    }}
                                                    className="text-sm text-gray-800 focus:outline-none min-w-[150px]"
                                                />
                                                <button onClick={() => saveEdit(msg._id)} className="text-green-500 hover:text-green-600"><FiCheck size={16} /></button>
                                                <button onClick={cancelEdit} className="text-red-400 hover:text-red-500"><FiX size={16} /></button>
                                            </div>
                                        ) : (
                                            <div className="relative flex items-center gap-1">
                                                {!isMe && (
                                                    <button
                                                        onClick={() => handleReply(msg)}
                                                        className="opacity-0 group-hover:opacity-100 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition order-first"
                                                    >
                                                        <FiCornerUpLeft size={13} className="text-gray-500" />
                                                    </button>
                                                )}

                                                <div className={'px-4 py-2.5 rounded-2xl text-sm ' + (isMe ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm')}>
                                                    {msg.text}
                                                    {msg.isEdited && <span className="text-xs ml-1 opacity-60">(edited)</span>}
                                                </div>

                                                {isMe && (
                                                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                                        <button onClick={() => handleReply(msg)} className="w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition">
                                                            <FiCornerUpLeft size={13} className="text-gray-500" />
                                                        </button>
                                                        <button onClick={() => startEdit(msg)} className="w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition">
                                                            <FiEdit2 size={13} className="text-gray-500" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <span className="text-xs text-gray-400 mt-1 px-1">{formatTime(msg.createdAt)}</span>
                                    </div>
                                </div>
                            );
                        })
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

                {/* Reply preview bar */}
                {replyTo && (
                    <div className="bg-primary-50 border-x border-primary-100 px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                            <FiCornerUpLeft size={14} className="text-primary-500 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-primary-600">
                                    Replying to {replyTo.sender?.name === user.name ? 'yourself' : replyTo.sender?.name}
                                </p>
                                <p className="text-xs text-primary-500 truncate">{replyTo.text}</p>
                            </div>
                        </div>
                        <button onClick={() => setReplyTo(null)} className="text-primary-400 hover:text-primary-600 shrink-0 ml-2">
                            <FiX size={16} />
                        </button>
                    </div>
                )}

                {/* Input */}
                <div className="bg-white rounded-b-xl border border-gray-100 border-t-0 p-3 flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={handleTyping}
                        onKeyDown={handleKeyDown}
                        placeholder={replyTo ? 'Write a reply...' : 'Type a message...'}
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
        </div>
    );
};

export default PatientChat;