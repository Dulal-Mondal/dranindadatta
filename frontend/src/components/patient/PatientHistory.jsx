import { formatDate } from '../../utils/formatDate';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { FiCalendar, FiFileText } from 'react-icons/fi';

const PatientHistory = ({ appointments = [], prescriptions = [] }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                    <FiCalendar className="text-primary-500" size={18} />
                    <h3 className="font-semibold text-gray-800">Appointment History</h3>
                    <span className="ml-auto text-xs text-gray-400">{appointments.length} total</span>
                </div>
                {appointments.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">No appointments yet</p>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {appointments.map((apt) => (
                            <div key={apt._id} className="flex items-center gap-3 p-4">
                                <img
                                    src={apt.doctor?.avatar || 'https://ui-avatars.com/api/?name=' + apt.doctor?.name + '&background=0ea5e9&color=fff&size=80'}
                                    alt={apt.doctor?.name}
                                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">Dr. {apt.doctor?.name}</p>
                                    <p className="text-xs text-gray-500">{formatDate(apt.appointmentDate)}</p>
                                </div>
                                <span className={'text-xs px-2.5 py-1 rounded-full font-medium ' + (APPOINTMENT_STATUS[apt.status]?.color || 'bg-gray-100 text-gray-600')}>
                                    {APPOINTMENT_STATUS[apt.status]?.label || apt.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                    <FiFileText className="text-purple-500" size={18} />
                    <h3 className="font-semibold text-gray-800">Prescription History</h3>
                    <span className="ml-auto text-xs text-gray-400">{prescriptions.length} total</span>
                </div>
                {prescriptions.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">No prescriptions yet</p>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {prescriptions.map((pres) => (
                            <div key={pres._id} className="flex items-center gap-3 p-4">
                                <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                                    <FiFileText className="text-purple-500" size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">Dr. {pres.doctor?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{pres.diagnosis}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs text-gray-400">{formatDate(pres.createdAt)}</p>
                                    {pres.pdfUrl && (
                                        <a href={pres.pdfUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-500 hover:underline">
                                            Download
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientHistory;