import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { getPatientStats } from '../../services/patientService';
import { getMyAppointments } from '../../services/appointmentService';
import { getMyPrescriptions } from '../../services/prescriptionService';
import { formatDate } from '../../utils/formatDate';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import {
    FiCalendar, FiFileText, FiCheckCircle,
    FiClock, FiVideo, FiMessageSquare, FiArrowRight,
} from 'react-icons/fi';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [statsRes, apptRes, presRes] = await Promise.all([
                getPatientStats(),
                getMyAppointments(),
                getMyPrescriptions(),
            ]);
            setStats(statsRes.data.stats);
            setAppointments(apptRes.data.appointments?.slice(0, 5) || []);
            setPrescriptions(presRes.data.prescriptions?.slice(0, 3) || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <><Navbar /><Loader fullScreen /></>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Welcome */}
                <div className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-2xl p-6 mb-8 text-white">
                    <div className="flex items-center gap-4">
                        <img
                            src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name + '&background=fff&color=0ea5e9&size=80'}
                            alt={user?.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30"
                        />
                        <div>
                            <p className="text-blue-100 text-sm">Welcome back,</p>
                            <h1 className="text-2xl font-bold">{user?.name}</h1>
                            <p className="text-blue-100 text-sm mt-0.5">Patient Account</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Appointments', value: stats?.totalAppointments || 0, icon: <FiCalendar size={22} />, color: 'bg-blue-50 text-blue-500' },
                        { label: 'Completed', value: stats?.completedAppointments || 0, icon: <FiCheckCircle size={22} />, color: 'bg-green-50 text-green-500' },
                        { label: 'Upcoming', value: stats?.upcomingAppointments || 0, icon: <FiClock size={22} />, color: 'bg-orange-50 text-orange-500' },
                        { label: 'Prescriptions', value: stats?.totalPrescriptions || 0, icon: <FiFileText size={22} />, color: 'bg-purple-50 text-purple-500' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className={'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ' + stat.color}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Find Doctor', icon: '🔍', to: '/doctors', color: 'bg-blue-500' },
                        { label: 'My Appointments', icon: '📅', to: '/patient/appointments', color: 'bg-green-500' },
                        { label: 'Prescriptions', icon: '📋', to: '/patient/prescriptions', color: 'bg-purple-500' },
                        { label: 'Messages', icon: '💬', to: '/doctors', color: 'bg-orange-500' },
                    ].map((action) => (
                        <Link
                            key={action.label}
                            to={action.to}
                            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col items-center gap-3 text-center group"
                        >
                            <div className={'w-12 h-12 rounded-xl flex items-center justify-center text-2xl ' + action.color + '/10'}>
                                {action.icon}
                            </div>
                            <p className="text-sm font-medium text-gray-700 group-hover:text-primary-500 transition">{action.label}</p>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Recent Appointments */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800">Recent Appointments</h2>
                            <Link to="/patient/appointments" className="text-sm text-primary-500 hover:underline flex items-center gap-1">
                                View all <FiArrowRight size={14} />
                            </Link>
                        </div>

                        {appointments.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <FiCalendar size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No appointments yet</p>
                                <Link to="/doctors" className="mt-3 inline-block text-sm text-primary-500 hover:underline">
                                    Book your first appointment
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {appointments.map((apt) => (
                                    <div key={apt._id} className="p-4 flex items-center gap-4">
                                        <img
                                            src={apt.doctor?.avatar || 'https://ui-avatars.com/api/?name=' + apt.doctor?.name + '&background=0ea5e9&color=fff&size=80'}
                                            alt={apt.doctor?.name}
                                            className="w-11 h-11 rounded-xl object-cover shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 truncate">Dr. {apt.doctor?.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{formatDate(apt.appointmentDate)} · {apt.timeSlot}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={'text-xs px-2.5 py-1 rounded-full font-medium ' + (APPOINTMENT_STATUS[apt.status]?.color || 'bg-gray-100 text-gray-600')}>
                                                {APPOINTMENT_STATUS[apt.status]?.label || apt.status}
                                            </span>
                                            {apt.status === 'approved' && (
                                                <Link
                                                    to={'/patient/video-call/' + apt.videoRoomId}
                                                    className="w-8 h-8 bg-green-50 text-green-500 rounded-lg flex items-center justify-center hover:bg-green-100 transition"
                                                >
                                                    <FiVideo size={14} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Prescriptions */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800">Prescriptions</h2>
                            <Link to="/patient/prescriptions" className="text-sm text-primary-500 hover:underline flex items-center gap-1">
                                View all <FiArrowRight size={14} />
                            </Link>
                        </div>

                        {prescriptions.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <FiFileText size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No prescriptions yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {prescriptions.map((pres) => (
                                    <div key={pres._id} className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                                                <FiFileText className="text-purple-500" size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">Dr. {pres.doctor?.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{formatDate(pres.createdAt)}</p>
                                                <p className="text-xs text-gray-600 mt-1 truncate">{pres.diagnosis}</p>
                                            </div>
                                        </div>
                                        {pres.pdfUrl && (
                                            <a
                                                href={pres.pdfUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-2 w-full text-center text-xs text-primary-500 border border-primary-200 rounded-lg py-1.5 hover:bg-primary-50 transition block"
                                            >
                                                Download PDF
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PatientDashboard;