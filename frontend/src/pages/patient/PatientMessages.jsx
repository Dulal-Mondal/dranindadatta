import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getConversations } from '../../services/messageService';
import { timeAgo } from '../../utils/formatDate';
import { FiMessageSquare, FiSearch } from 'react-icons/fi';

const PatientMessages = () => {
    const { user } = useAuth();
    const { isOnline } = useSocket();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const { data } = await getConversations();
            setConversations(data.conversations || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getOtherPerson = (conv) => {
        return conv.participants?.find((p) => p._id !== user._id);
    };

    const filtered = conversations.filter((conv) => {
        const other = getOtherPerson(conv);
        return other?.name?.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Messages</h1>

                <div className="relative mb-4">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search doctors..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    />
                </div>

                {loading ? (
                    <Loader />
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <FiMessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">No conversations yet</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                        {filtered.map((conv) => {
                            const other = getOtherPerson(conv);
                            if (!other) return null;

                            const unread = conv.unreadCount?.[user._id] || 0;

                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => navigate('/patient/chat/' + other._id)}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition"
                                >
                                    <div className="relative shrink-0">
                                        <img
                                            src={other.avatar || 'https://ui-avatars.com/api/?name=' + other.name + '&background=0ea5e9&color=fff&size=80'}
                                            alt={other.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        {isOnline(other._id) && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-gray-800 text-sm">Dr. {other.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {conv.lastMessage?.createdAt ? timeAgo(conv.lastMessage.createdAt) : ''}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-0.5">
                                            <p className="text-sm text-gray-500 truncate">
                                                {conv.lastMessage?.text || 'No messages yet'}
                                            </p>
                                            {unread > 0 && (
                                                <span className="ml-2 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center shrink-0">
                                                    {unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default PatientMessages;