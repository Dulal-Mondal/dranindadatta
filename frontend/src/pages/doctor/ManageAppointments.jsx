import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { getDoctorAppointments, approveAppointment, rejectAppointment, completeAppointment } from '../../services/appointmentService';
import { formatDate } from '../../utils/formatDate';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';
import { FiCalendar, FiCheck, FiX, FiVideo, FiMessageSquare, FiFileText } from 'react-icons/fi';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const { data } = await getDoctorAppointments();
            setAppointments(data.appointments || []);
        } catch (err) {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveAppointment(id);
            toast.success('Appointment approved');
            fetchAppointments();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to approve');
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Reject this appointment?')) return;
        try {
            await rejectAppointment(id);
            toast.success('Appointment rejected');
            fetchAppointments();
        } catch (err) {
            toast.error('Failed to reject');
        }
    };

    const handleComplete = async (id) => {
        try {
            await completeAppointment(id);
            toast.success('Marked as completed');
            fetchAppointments();
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Appointments</h1>

                <div className="flex gap-2 mb-6 flex-wrap">
                    {['all', 'pending', 'approved', 'completed', 'rejected', 'cancelled'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={'px-4 py-1.5 rounded-full text-sm font-medium transition capitalize ' + (filter === s ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300')}
                        >
                            {s} {s !== 'all' && ('(' + appointments.filter((a) => a.status === s).length + ')')}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <Loader />
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <FiCalendar size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">No appointments found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((apt) => (
                            <div key={apt._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <img
                                        src={apt.patient?.avatar || 'https://ui-avatars.com/api/?name=' + apt.patient?.name + '&background=6366f1&color=fff&size=80'}
                                        alt={apt.patient?.name}
                                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{apt.patient?.name}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{apt.patient?.email}</p>
                                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><FiCalendar size={13} />{formatDate(apt.appointmentDate)}</span>
                                            <span>· {apt.timeSlot}</span>
                                            <span>· {apt.type}</span>
                                        </div>
                                        {apt.symptoms && (
                                            <p className="text-xs text-gray-400 mt-1 bg-gray-50 rounded-lg px-3 py-1.5 mt-2">
                                                Symptoms: {apt.symptoms}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2 shrink-0">
                                        <span className={'text-xs px-3 py-1.5 rounded-full font-medium ' + (APPOINTMENT_STATUS[apt.status]?.color || 'bg-gray-100 text-gray-600')}>
                                            {APPOINTMENT_STATUS[apt.status]?.label || apt.status}
                                        </span>

                                        {apt.status === 'pending' && apt.isPaid && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(apt._id)}
                                                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <FiCheck size={12} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(apt._id)}
                                                    className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <FiX size={12} /> Reject
                                                </button>
                                            </>
                                        )}

                                        {apt.status === 'pending' && !apt.isPaid && (
                                            <span className="text-xs bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-lg">
                                                Payment Pending
                                            </span>
                                        )}

                                        {apt.status === 'approved' && (
                                            <>
                                                <Link
                                                    to={'/doctor/video-call/' + apt.videoRoomId}
                                                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <FiVideo size={12} /> Start Call
                                                </Link>
                                                <Link
                                                    to={'/doctor/chat/' + apt.patient?._id}
                                                    className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-500 text-xs px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <FiMessageSquare size={12} /> Chat
                                                </Link>
                                                <Link
                                                    to={'/doctor/prescribe/' + apt._id}
                                                    className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-500 text-xs px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <FiFileText size={12} /> Prescribe
                                                </Link>
                                                <button
                                                    onClick={() => handleComplete(apt._id)}
                                                    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <FiCheck size={12} /> Complete
                                                </button>
                                            </>
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

export default ManageAppointments;