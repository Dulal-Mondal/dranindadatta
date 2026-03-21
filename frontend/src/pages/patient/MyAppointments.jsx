import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { getMyAppointments, cancelAppointment } from '../../services/appointmentService';
import { formatDate } from '../../utils/formatDate';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';
import { FiCalendar, FiVideo, FiMessageSquare, FiX, FiClock } from 'react-icons/fi';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const { data } = await getMyAppointments();
            setAppointments(data.appointments || []);
        } catch (err) {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await cancelAppointment(id);
            toast.success('Appointment cancelled');
            fetchAppointments();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel');
        }
    };

    const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
                    <Link to="/doctors" className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                        Book New
                    </Link>
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                    {['all', 'pending', 'approved', 'completed', 'cancelled', 'rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={'px-4 py-1.5 rounded-full text-sm font-medium transition capitalize ' + (filter === s ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300')}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <Loader />
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <FiCalendar size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">No appointments found</p>
                        <Link to="/doctors" className="mt-4 inline-block text-primary-500 hover:underline text-sm">
                            Book an appointment
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((apt) => (
                            <div key={apt._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <img
                                        src={apt.doctor?.avatar || 'https://ui-avatars.com/api/?name=' + apt.doctor?.name + '&background=0ea5e9&color=fff&size=80'}
                                        alt={apt.doctor?.name}
                                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">Dr. {apt.doctor?.name}</h3>
                                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><FiCalendar size={13} />{formatDate(apt.appointmentDate)}</span>
                                            <span className="flex items-center gap-1"><FiClock size={13} />{apt.timeSlot}</span>
                                            <span className="flex items-center gap-1"><FiVideo size={13} />{apt.type}</span>
                                        </div>
                                        {apt.symptoms && (
                                            <p className="text-xs text-gray-400 mt-1">Symptoms: {apt.symptoms}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={'text-xs px-3 py-1.5 rounded-full font-medium ' + (APPOINTMENT_STATUS[apt.status]?.color || 'bg-gray-100 text-gray-600')}>
                                            {APPOINTMENT_STATUS[apt.status]?.label || apt.status}
                                        </span>
                                        {apt.status === 'approved' && (
                                            <>
                                                <Link
                                                    to={'/patient/video-call/' + apt.videoRoomId}
                                                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <FiVideo size={12} /> Join Call
                                                </Link>
                                                <Link
                                                    to={'/patient/chat/' + apt.doctor?._id}
                                                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <FiMessageSquare size={12} /> Chat
                                                </Link>
                                            </>
                                        )}
                                        {(apt.status === 'pending' || apt.status === 'approved') && (
                                            <button
                                                onClick={() => handleCancel(apt._id)}
                                                className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs px-3 py-1.5 rounded-lg transition"
                                            >
                                                <FiX size={12} /> Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyAppointments;