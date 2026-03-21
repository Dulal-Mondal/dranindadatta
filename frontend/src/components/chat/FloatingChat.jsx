// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { useSocket } from '../../context/SocketContext';
// import { getMessages, getConversations, editMessage } from '../../services/messageService';
// import { formatTime, timeAgo } from '../../utils/formatDate';
// import toast from 'react-hot-toast';
// import {
//     FiMessageSquare, FiX, FiMinus, FiSend,
//     FiArrowLeft, FiEdit2, FiCheck, FiCornerUpLeft,
//     FiChevronDown,
// } from 'react-icons/fi';

// const FloatingChat = () => {
//     const { user } = useAuth();
//     const { socket, isOnline } = useSocket();
//     const navigate = useNavigate();

//     const [isOpen, setIsOpen] = useState(false);
//     const [isMinimized, setIsMinimized] = useState(false);
//     const [activeConv, setActiveConv] = useState(null);
//     const [conversations, setConversations] = useState([]);
//     const [messages, setMessages] = useState([]);
//     const [text, setText] = useState('');
//     const [typing, setTyping] = useState(false);
//     const [unreadTotal, setUnreadTotal] = useState(0);
//     const [editingId, setEditingId] = useState(null);
//     const [editText, setEditText] = useState('');
//     const [replyTo, setReplyTo] = useState(null);

//     const messagesEndRef = useRef(null);
//     const inputRef = useRef(null);
//     const editInputRef = useRef(null);
//     const typingTimeoutRef = useRef(null);

//     useEffect(() => {
//         if (!user) return;
//         fetchConversations();
//     }, [user]);

//     useEffect(() => {
//         if (!socket) return;

//         socket.on('receive_message', ({ message, conversationId }) => {
//             if (activeConv && conversationId === getConvId(activeConv._id)) {
//                 setMessages((prev) => [...prev, message]);
//             }
//             fetchConversations();
//         });

//         socket.on('message_sent', ({ message }) => {
//             setMessages((prev) => [...prev, message]);
//         });

//         socket.on('user_typing', ({ senderId }) => {
//             if (activeConv && senderId === activeConv._id) setTyping(true);
//         });

//         socket.on('user_stop_typing', ({ senderId }) => {
//             if (activeConv && senderId === activeConv._id) setTyping(false);
//         });

//         return () => {
//             socket.off('receive_message');
//             socket.off('message_sent');
//             socket.off('user_typing');
//             socket.off('user_stop_typing');
//         };
//     }, [socket, activeConv]);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     useEffect(() => {
//         if (editingId && editInputRef.current) editInputRef.current.focus();
//     }, [editingId]);

//     useEffect(() => {
//         if (replyTo && inputRef.current) inputRef.current.focus();
//     }, [replyTo]);

//     const getConvId = (otherId) => {
//         if (!user) return '';
//         return [user._id, otherId].sort().join('_');
//     };

//     const fetchConversations = async () => {
//         try {
//             const { data } = await getConversations();
//             const convs = data.conversations || [];
//             setConversations(convs);
//             const total = convs.reduce((acc, c) => {
//                 const unread = c.unreadCount?.[user._id] || 0;
//                 return acc + unread;
//             }, 0);
//             setUnreadTotal(total);
//         } catch (err) { console.error(err); }
//     };

//     const openConversation = async (conv) => {
//         const other = conv.participants?.find((p) => p._id !== user._id);
//         if (!other) return;
//         setActiveConv(other);
//         setMessages([]);
//         setReplyTo(null);
//         try {
//             const { data } = await getMessages(other._id);
//             setMessages(data.messages || []);
//         } catch (err) { console.error(err); }
//     };

//     const handleSend = () => {
//         if (!text.trim() || !socket || !activeConv) return;
//         socket.emit('send_message', {
//             senderId: user._id,
//             receiverId: activeConv._id,
//             text: text.trim(),
//             replyTo: replyTo?._id || null,
//         });
//         socket.emit('stop_typing', { senderId: user._id, receiverId: activeConv._id });
//         setText('');
//         setReplyTo(null);
//     };

//     const handleTyping = (e) => {
//         setText(e.target.value);
//         if (!socket || !activeConv) return;
//         socket.emit('typing', { senderId: user._id, receiverId: activeConv._id });
//         clearTimeout(typingTimeoutRef.current);
//         typingTimeoutRef.current = setTimeout(() => {
//             socket.emit('stop_typing', { senderId: user._id, receiverId: activeConv._id });
//         }, 1500);
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
//         if (e.key === 'Escape') setReplyTo(null);
//     };

//     const startEdit = (msg) => { setEditingId(msg._id); setEditText(msg.text); };
//     const cancelEdit = () => { setEditingId(null); setEditText(''); };

//     const saveEdit = async (messageId) => {
//         if (!editText.trim()) return;
//         try {
//             await editMessage(messageId, editText.trim());
//             setMessages((prev) =>
//                 prev.map((m) => (m._id === messageId ? { ...m, text: editText.trim(), isEdited: true } : m))
//             );
//             cancelEdit();
//             toast.success('Updated');
//         } catch { toast.error('Failed'); }
//     };

//     const getReplyPreview = (msg) => {
//         if (!msg?.replyTo) return null;
//         return typeof msg.replyTo === 'object' ? msg.replyTo : messages.find((m) => m._id === msg.replyTo);
//     };

//     if (!user) return null;

//     return (
//         <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">

//             {/* Chat Window */}
//             {isOpen && !isMinimized && (
//                 <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: '460px' }}>

//                     {/* Header */}
//                     <div className="bg-primary-500 px-4 py-3 flex items-center justify-between shrink-0">
//                         {activeConv ? (
//                             <div className="flex items-center gap-2 flex-1 min-w-0">
//                                 <button onClick={() => { setActiveConv(null); setMessages([]); }} className="text-white/80 hover:text-white mr-1">
//                                     <FiArrowLeft size={16} />
//                                 </button>
//                                 <div className="relative shrink-0">
//                                     <img
//                                         src={activeConv.avatar || 'https://ui-avatars.com/api/?name=' + activeConv.name + '&background=fff&color=0ea5e9&size=40'}
//                                         className="w-7 h-7 rounded-full object-cover"
//                                         alt={activeConv.name}
//                                     />
//                                     {isOnline(activeConv._id) && (
//                                         <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-white" />
//                                     )}
//                                 </div>
//                                 <div className="min-w-0">
//                                     <p className="text-white text-sm font-semibold truncate">{activeConv.name}</p>
//                                     <p className="text-white/70 text-xs">{isOnline(activeConv._id) ? 'Online' : 'Offline'}</p>
//                                 </div>
//                             </div>
//                         ) : (
//                             <p className="text-white font-semibold text-sm">Messages</p>
//                         )}
//                         <div className="flex items-center gap-1 shrink-0">
//                             <button onClick={() => setIsMinimized(true)} className="w-6 h-6 text-white/80 hover:text-white flex items-center justify-center rounded-lg hover:bg-white/10">
//                                 <FiMinus size={14} />
//                             </button>
//                             <button onClick={() => { setIsOpen(false); setActiveConv(null); }} className="w-6 h-6 text-white/80 hover:text-white flex items-center justify-center rounded-lg hover:bg-white/10">
//                                 <FiX size={14} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Conversation List */}
//                     {!activeConv && (
//                         <div className="flex-1 overflow-y-auto">
//                             {conversations.length === 0 ? (
//                                 <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
//                                     <FiMessageSquare size={32} className="mb-2 opacity-30" />
//                                     <p>No conversations yet</p>
//                                 </div>
//                             ) : (
//                                 conversations.map((conv) => {
//                                     const other = conv.participants?.find((p) => p._id !== user._id);
//                                     if (!other) return null;
//                                     const unread = conv.unreadCount?.[user._id] || 0;
//                                     return (
//                                         <div
//                                             key={conv._id}
//                                             onClick={() => openConversation(conv)}
//                                             className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition"
//                                         >
//                                             <div className="relative shrink-0">
//                                                 <img
//                                                     src={other.avatar || 'https://ui-avatars.com/api/?name=' + other.name + '&background=0ea5e9&color=fff&size=40'}
//                                                     className="w-10 h-10 rounded-full object-cover"
//                                                     alt={other.name}
//                                                 />
//                                                 {isOnline(other._id) && (
//                                                     <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
//                                                 )}
//                                             </div>
//                                             <div className="flex-1 min-w-0">
//                                                 <div className="flex items-center justify-between">
//                                                     <p className="text-sm font-semibold text-gray-800 truncate">{other.name}</p>
//                                                     <p className="text-xs text-gray-400 shrink-0 ml-1">
//                                                         {conv.lastMessage?.createdAt ? timeAgo(conv.lastMessage.createdAt) : ''}
//                                                     </p>
//                                                 </div>
//                                                 <div className="flex items-center justify-between mt-0.5">
//                                                     <p className="text-xs text-gray-500 truncate">{conv.lastMessage?.text || 'No messages'}</p>
//                                                     {unread > 0 && (
//                                                         <span className="ml-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center shrink-0">
//                                                             {unread}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })
//                             )}
//                         </div>
//                     )}

//                     {/* Chat Messages */}
//                     {activeConv && (
//                         <>
//                             <div className="flex-1 overflow-y-auto p-3 space-y-2">
//                                 {messages.length === 0 ? (
//                                     <p className="text-center text-gray-400 text-xs py-6">No messages yet 👋</p>
//                                 ) : (
//                                     messages.map((msg, i) => {
//                                         const isMe = msg.sender?._id === user._id || msg.sender === user._id;
//                                         const isEditing = editingId === msg._id;
//                                         const replied = getReplyPreview(msg);

//                                         return (
//                                             <div key={i} className={'flex ' + (isMe ? 'justify-end' : 'justify-start')}>
//                                                 <div className={'group flex flex-col max-w-[75%] ' + (isMe ? 'items-end' : 'items-start')}>

//                                                     {replied && (
//                                                         <div className={'mb-1 px-2 py-1 rounded-lg border-l-2 text-xs ' + (isMe ? 'bg-primary-100 border-primary-300 text-primary-700' : 'bg-gray-100 border-gray-300 text-gray-600')}>
//                                                             <p className="font-semibold">{replied.sender?.name === user.name ? 'You' : replied.sender?.name}</p>
//                                                             <p className="truncate">{replied.text}</p>
//                                                         </div>
//                                                     )}

//                                                     {isEditing ? (
//                                                         <div className="flex items-center gap-1 bg-white border border-primary-300 rounded-xl px-2 py-1.5 shadow-sm text-xs">
//                                                             <input
//                                                                 ref={editInputRef}
//                                                                 value={editText}
//                                                                 onChange={(e) => setEditText(e.target.value)}
//                                                                 onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(msg._id); if (e.key === 'Escape') cancelEdit(); }}
//                                                                 className="focus:outline-none min-w-[100px] text-gray-800"
//                                                             />
//                                                             <button onClick={() => saveEdit(msg._id)} className="text-green-500"><FiCheck size={13} /></button>
//                                                             <button onClick={cancelEdit} className="text-red-400"><FiX size={13} /></button>
//                                                         </div>
//                                                     ) : (
//                                                         <div className={'relative flex items-center gap-1 ' + (isMe ? 'flex-row-reverse' : 'flex-row')}>
//                                                             <div className={'px-3 py-2 rounded-2xl text-xs ' + (isMe ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm')}>
//                                                                 {msg.text}
//                                                                 {msg.isEdited && <span className="opacity-60 ml-1">(edited)</span>}
//                                                             </div>
//                                                             <div className="opacity-0 group-hover:opacity-100 flex gap-0.5">
//                                                                 <button onClick={() => setReplyTo(msg)} className="w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
//                                                                     <FiCornerUpLeft size={10} className="text-gray-500" />
//                                                                 </button>
//                                                                 {isMe && (
//                                                                     <button onClick={() => startEdit(msg)} className="w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
//                                                                         <FiEdit2 size={10} className="text-gray-500" />
//                                                                     </button>
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                     )}

//                                                     <span className="text-xs text-gray-400 mt-0.5 px-1">{formatTime(msg.createdAt)}</span>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })
//                                 )}

//                                 {typing && (
//                                     <div className="flex justify-start">
//                                         <div className="bg-gray-100 rounded-xl px-3 py-2 flex gap-1">
//                                             <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//                                             <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//                                             <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//                                         </div>
//                                     </div>
//                                 )}
//                                 <div ref={messagesEndRef} />
//                             </div>

//                             {replyTo && (
//                                 <div className="bg-primary-50 border-t border-primary-100 px-3 py-1.5 flex items-center justify-between shrink-0">
//                                     <div className="flex items-center gap-1.5 min-w-0">
//                                         <FiCornerUpLeft size={12} className="text-primary-500 shrink-0" />
//                                         <div className="min-w-0">
//                                             <p className="text-xs font-semibold text-primary-600">{replyTo.sender?.name === user.name ? 'You' : replyTo.sender?.name}</p>
//                                             <p className="text-xs text-primary-500 truncate">{replyTo.text}</p>
//                                         </div>
//                                     </div>
//                                     <button onClick={() => setReplyTo(null)} className="text-primary-400 hover:text-primary-600 ml-2 shrink-0">
//                                         <FiX size={13} />
//                                     </button>
//                                 </div>
//                             )}

//                             <div className="p-2 border-t border-gray-100 flex items-center gap-2 shrink-0">
//                                 <input
//                                     ref={inputRef}
//                                     type="text"
//                                     value={text}
//                                     onChange={handleTyping}
//                                     onKeyDown={handleKeyDown}
//                                     placeholder={replyTo ? 'Write a reply...' : 'Type a message...'}
//                                     className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
//                                 />
//                                 <button
//                                     onClick={handleSend}
//                                     disabled={!text.trim()}
//                                     className="w-8 h-8 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition shrink-0"
//                                 >
//                                     <FiSend size={13} />
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             )}

//             {/* Minimized bar */}
//             {isOpen && isMinimized && (
//                 <div
//                     onClick={() => setIsMinimized(false)}
//                     className="bg-primary-500 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer hover:bg-primary-600 transition"
//                 >
//                     <FiMessageSquare size={16} />
//                     <span className="text-sm font-medium">
//                         {activeConv ? activeConv.name : 'Messages'}
//                     </span>
//                     {unreadTotal > 0 && (
//                         <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                             {unreadTotal}
//                         </span>
//                     )}
//                     <FiChevronDown size={14} className="ml-1" />
//                 </div>
//             )}

//             {/* Floating Button */}
//             {!isOpen && (
//                 <button
//                     onClick={() => setIsOpen(true)}
//                     className="w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center transition hover:scale-105 active:scale-95"
//                 >
//                     <FiMessageSquare size={22} />
//                     {unreadTotal > 0 && (
//                         <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
//                             {unreadTotal > 9 ? '9+' : unreadTotal}
//                         </span>
//                     )}
//                 </button>
//             )}
//         </div>
//     );
// };

// export default FloatingChat;






import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getMessages, getConversations, editMessage } from '../../services/messageService';
import { formatTime, timeAgo } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import {
    FiMessageSquare, FiX, FiMinus, FiSend,
    FiEdit2, FiCheck, FiCornerUpLeft, FiChevronDown,
    FiMaximize2,
} from 'react-icons/fi';

// ─── Single Chat Window ────────────────────────────────
const ChatWindow = ({ person, onClose, onMinimize, isMinimized, socket, user, isOnline }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [typing, setTyping] = useState(false);
    const [unread, setUnread] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [replyTo, setReplyTo] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const editInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        fetchMessages();
    }, [person._id]);

    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', ({ message }) => {
            const senderId = message.sender?._id || message.sender;
            if (senderId === person._id) {
                setMessages((prev) => [...prev, message]);
                if (isMinimized) setUnread((prev) => prev + 1);
            }
        });

        socket.on('message_sent', ({ message }) => {
            const receiverId = message.receiver?._id || message.receiver;
            if (receiverId === person._id) {
                setMessages((prev) => [...prev, message]);
            }
        });

        socket.on('user_typing', ({ senderId }) => {
            if (senderId === person._id) setTyping(true);
        });

        socket.on('user_stop_typing', ({ senderId }) => {
            if (senderId === person._id) setTyping(false);
        });

        return () => {
            socket.off('receive_message');
            socket.off('message_sent');
            socket.off('user_typing');
            socket.off('user_stop_typing');
        };
    }, [socket, person._id, isMinimized]);

    useEffect(() => {
        if (!isMinimized) {
            setUnread(0);
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isMinimized]);

    useEffect(() => {
        if (editingId && editInputRef.current) editInputRef.current.focus();
    }, [editingId]);

    useEffect(() => {
        if (replyTo && inputRef.current) inputRef.current.focus();
    }, [replyTo]);

    const fetchMessages = async () => {
        try {
            const { data } = await getMessages(person._id);
            setMessages(data.messages || []);
        } catch (err) { console.error(err); }
    };

    const handleSend = () => {
        if (!text.trim() || !socket) return;
        socket.emit('send_message', {
            senderId: user._id,
            receiverId: person._id,
            text: text.trim(),
            replyTo: replyTo?._id || null,
        });
        socket.emit('stop_typing', { senderId: user._id, receiverId: person._id });
        setText('');
        setReplyTo(null);
    };

    const handleTyping = (e) => {
        setText(e.target.value);
        if (!socket) return;
        socket.emit('typing', { senderId: user._id, receiverId: person._id });
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { senderId: user._id, receiverId: person._id });
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
            toast.success('Updated');
        } catch { toast.error('Failed'); }
    };

    const getReplyPreview = (msg) => {
        if (!msg?.replyTo) return null;
        return typeof msg.replyTo === 'object' ? msg.replyTo : messages.find((m) => m._id === msg.replyTo);
    };

    // ── Minimized state ──
    if (isMinimized) {
        return (
            <div
                onClick={() => { onMinimize(person._id, false); setUnread(0); }}
                className="bg-white border border-gray-200 shadow-lg rounded-xl px-3 py-2 flex items-center gap-2 cursor-pointer hover:shadow-xl transition w-44"
            >
                <div className="relative shrink-0">
                    <img
                        src={person.avatar || 'https://ui-avatars.com/api/?name=' + person.name + '&background=0ea5e9&color=fff&size=40'}
                        className="w-7 h-7 rounded-full object-cover"
                        alt={person.name}
                    />
                    {isOnline(person._id) && <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-white" />}
                </div>
                <p className="text-xs font-semibold text-gray-800 flex-1 truncate">{person.name}</p>
                {unread > 0 && (
                    <span className="w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shrink-0">
                        {unread}
                    </span>
                )}
                <FiMaximize2 size={11} className="text-gray-400 shrink-0" />
            </div>
        );
    }

    // ── Full window ──
    return (
        <div className="w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: '420px' }}>

            {/* Header */}
            <div className="bg-primary-500 px-3 py-2.5 flex items-center gap-2 shrink-0">
                <div className="relative shrink-0">
                    <img
                        src={person.avatar || 'https://ui-avatars.com/api/?name=' + person.name + '&background=fff&color=0ea5e9&size=40'}
                        className="w-7 h-7 rounded-full object-cover"
                        alt={person.name}
                    />
                    {isOnline(person._id) && <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{person.name}</p>
                    <p className="text-white/70 text-xs">{isOnline(person._id) ? 'Online' : 'Offline'}</p>
                </div>
                <button onClick={() => onMinimize(person._id, true)} className="w-5 h-5 text-white/80 hover:text-white flex items-center justify-center hover:bg-white/10 rounded">
                    <FiMinus size={12} />
                </button>
                <button onClick={() => onClose(person._id)} className="w-5 h-5 text-white/80 hover:text-white flex items-center justify-center hover:bg-white/10 rounded">
                    <FiX size={12} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-400 text-xs py-6">No messages yet 👋</p>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                        const isEditing = editingId === msg._id;
                        const replied = getReplyPreview(msg);

                        return (
                            <div key={i} className={'flex ' + (isMe ? 'justify-end' : 'justify-start')}>
                                <div className={'group flex flex-col max-w-[78%] ' + (isMe ? 'items-end' : 'items-start')}>

                                    {replied && (
                                        <div className={'mb-1 px-2 py-1 rounded-lg border-l-2 text-xs ' + (isMe ? 'bg-primary-100 border-primary-300 text-primary-700' : 'bg-white border-gray-300 text-gray-600')}>
                                            <p className="font-semibold">{replied.sender?.name === user.name ? 'You' : replied.sender?.name}</p>
                                            <p className="truncate opacity-80">{replied.text}</p>
                                        </div>
                                    )}

                                    {isEditing ? (
                                        <div className="flex items-center gap-1 bg-white border border-primary-300 rounded-xl px-2 py-1.5 shadow-sm">
                                            <input
                                                ref={editInputRef}
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(msg._id); if (e.key === 'Escape') cancelEdit(); }}
                                                className="text-xs focus:outline-none min-w-[80px] text-gray-800"
                                            />
                                            <button onClick={() => saveEdit(msg._id)} className="text-green-500"><FiCheck size={12} /></button>
                                            <button onClick={cancelEdit} className="text-red-400"><FiX size={12} /></button>
                                        </div>
                                    ) : (
                                        <div className={'flex items-center gap-1 ' + (isMe ? 'flex-row-reverse' : 'flex-row')}>
                                            <div className={'px-3 py-2 rounded-2xl text-xs leading-relaxed ' + (isMe ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm shadow-sm')}>
                                                {msg.text}
                                                {msg.isEdited && <span className="opacity-60 ml-1 text-xs">(edited)</span>}
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition">
                                                <button onClick={() => setReplyTo(msg)} className="w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                                                    <FiCornerUpLeft size={9} className="text-gray-500" />
                                                </button>
                                                {isMe && (
                                                    <button onClick={() => startEdit(msg)} className="w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                                                        <FiEdit2 size={9} className="text-gray-500" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <span className="text-xs text-gray-400 mt-0.5">{formatTime(msg.createdAt)}</span>
                                </div>
                            </div>
                        );
                    })
                )}

                {typing && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-xl px-3 py-2 flex gap-1 shadow-sm">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Reply bar */}
            {replyTo && (
                <div className="bg-primary-50 border-t border-primary-100 px-3 py-1.5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <FiCornerUpLeft size={11} className="text-primary-500 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-primary-600">{replyTo.sender?.name === user.name ? 'You' : replyTo.sender?.name}</p>
                            <p className="text-xs text-primary-500 truncate">{replyTo.text}</p>
                        </div>
                    </div>
                    <button onClick={() => setReplyTo(null)} className="text-primary-400 ml-2 shrink-0"><FiX size={12} /></button>
                </div>
            )}

            {/* Input */}
            <div className="p-2 border-t border-gray-100 flex items-center gap-1.5 shrink-0 bg-white">
                <input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={handleTyping}
                    onKeyDown={handleKeyDown}
                    placeholder={replyTo ? 'Write a reply...' : 'Message...'}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className="w-7 h-7 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition shrink-0"
                >
                    <FiSend size={11} />
                </button>
            </div>
        </div>
    );
};

// ─── Main Floating Chat Manager ────────────────────────
const FloatingChat = () => {
    const { user } = useAuth();
    const { socket, isOnline } = useSocket();

    const [isListOpen, setIsListOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [openChats, setOpenChats] = useState([]); // [{ person, minimized }]
    const [unreadTotal, setUnreadTotal] = useState(0);

    useEffect(() => {
        if (!user) return;
        fetchConversations();
    }, [user]);

    useEffect(() => {
        if (!socket) return;
        socket.on('receive_message', () => {
            fetchConversations();
        });
        return () => socket.off('receive_message');
    }, [socket]);

    const fetchConversations = async () => {
        try {
            const { data } = await getConversations();
            const convs = data.conversations || [];
            setConversations(convs);
            const total = convs.reduce((acc, c) => acc + (c.unreadCount?.[user._id] || 0), 0);
            setUnreadTotal(total);
        } catch (err) { console.error(err); }
    };

    const openChat = (conv) => {
        const other = conv.participants?.find((p) => p._id !== user._id);
        if (!other) return;
        const alreadyOpen = openChats.find((c) => c.person._id === other._id);
        if (alreadyOpen) {
            setOpenChats((prev) =>
                prev.map((c) => c.person._id === other._id ? { ...c, minimized: false } : c)
            );
        } else {
            // max 3 windows open
            const newChats = openChats.length >= 3
                ? [...openChats.slice(1), { person: other, minimized: false }]
                : [...openChats, { person: other, minimized: false }];
            setOpenChats(newChats);
        }
        setIsListOpen(false);
    };

    const closeChat = (personId) => {
        setOpenChats((prev) => prev.filter((c) => c.person._id !== personId));
    };

    const minimizeChat = (personId, minimized) => {
        setOpenChats((prev) =>
            prev.map((c) => c.person._id === personId ? { ...c, minimized } : c)
        );
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">

            {/* Open chat windows — left of button */}
            <div className="flex items-end gap-2 mb-2 flex-wrap-reverse justify-end">
                {openChats.map((chat) => (
                    <ChatWindow
                        key={chat.person._id}
                        person={chat.person}
                        isMinimized={chat.minimized}
                        onClose={closeChat}
                        onMinimize={minimizeChat}
                        socket={socket}
                        user={user}
                        isOnline={isOnline}
                    />
                ))}
            </div>

            {/* Conversation list popup */}
            {isListOpen && (
                <div className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-primary-500">
                        <p className="text-white font-semibold text-sm">Conversations</p>
                        <button onClick={() => setIsListOpen(false)} className="text-white/80 hover:text-white">
                            <FiX size={16} />
                        </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm">
                                <FiMessageSquare size={28} className="mx-auto mb-2 opacity-30" />
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const other = conv.participants?.find((p) => p._id !== user._id);
                                if (!other) return null;
                                const unread = conv.unreadCount?.[user._id] || 0;
                                const isOpen = openChats.find((c) => c.person._id === other._id);
                                return (
                                    <div
                                        key={conv._id}
                                        onClick={() => openChat(conv)}
                                        className={'flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 transition ' + (isOpen ? 'bg-primary-50' : 'hover:bg-gray-50')}
                                    >
                                        <div className="relative shrink-0">
                                            <img
                                                src={other.avatar || 'https://ui-avatars.com/api/?name=' + other.name + '&background=0ea5e9&color=fff&size=40'}
                                                className="w-10 h-10 rounded-full object-cover"
                                                alt={other.name}
                                            />
                                            {isOnline(other._id) && (
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{other.name}</p>
                                                <p className="text-xs text-gray-400 ml-1 shrink-0">
                                                    {conv.lastMessage?.createdAt ? timeAgo(conv.lastMessage.createdAt) : ''}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-0.5">
                                                <p className="text-xs text-gray-500 truncate">{conv.lastMessage?.text || 'No messages'}</p>
                                                {unread > 0 && (
                                                    <span className="ml-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center shrink-0">{unread}</span>
                                                )}
                                            </div>
                                        </div>
                                        {isOpen && <span className="text-xs text-primary-500 font-medium shrink-0">Open</span>}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Main floating button */}
            <button
                onClick={() => setIsListOpen(!isListOpen)}
                className="relative w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center transition hover:scale-105 active:scale-95"
            >
                {isListOpen ? <FiChevronDown size={22} /> : <FiMessageSquare size={22} />}
                {unreadTotal > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadTotal > 9 ? '9+' : unreadTotal}
                    </span>
                )}
            </button>
        </div>
    );
};

export default FloatingChat;