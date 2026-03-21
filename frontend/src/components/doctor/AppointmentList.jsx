import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { FiCalendar, FiClock, FiVideo, FiMessageSquare } from 'react-icons/fi';

const AppointmentList = ({ appointments = [], role = 'patient', onApprove, onReject, onComplete }) => {
    if (appointments.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <FiCalendar size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No appointments found</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-50">
            {appointments.map((apt) => {
                const person = role === 'patient' ? apt.doctor : apt.patient;
                const chatLink = role === 'patient'
                    ? '/patient/chat/' + apt.doctor?._id
                    : '/doctor/chat/' + apt.patient?._id;
                const videoLink = role === 'patient'
                    ? '/patient/video-call/' + apt.videoRoomId
                    : '/doctor/video-call/' + apt.videoRoomId;

                return (
                    <div key={apt._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                        <img
                            src={person?.avatar || 'https://ui-avatars.com/api/?name=' + person?.name + '&background=0ea5e9&color=fff&size=80'}
                            alt={person?.name}
                            className="w-11 h-11 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm truncate">
                                {role === 'patient' ? 'Dr. ' : ''}{person?.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 flex-wrap">
                                <span className="flex items-center gap-1"><FiCalendar size={11} />{formatDate(apt.appointmentDate)}</span>
                                <span className="flex items-center gap-1"><FiClock size={11} />{apt.timeSlot}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                            <span className={'text-xs px-2.5 py-1 rounded-full font-medium ' + (APPOINTMENT_STATUS[apt.status]?.color || 'bg-gray-100 text-gray-600')}>
                                {APPOINTMENT_STATUS[apt.status]?.label || apt.status}
                            </span>

                            {apt.status === 'approved' && (
                                <>
                                    <Link to={videoLink} className="w-7 h-7 bg-green-50 text-green-500 rounded-lg flex items-center justify-center hover:bg-green-100 transition">
                                        <FiVideo size={13} />
                                    </Link>
                                    <Link to={chatLink} className="w-7 h-7 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-100 transition">
                                        <FiMessageSquare size={13} />
                                    </Link>
                                </>
                            )}

                            {role === 'doctor' && apt.status === 'pending' && apt.isPaid && onApprove && (
                                <button
                                    onClick={() => onApprove(apt._id)}
                                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded-lg transition"
                                >
                                    Approve
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AppointmentList;