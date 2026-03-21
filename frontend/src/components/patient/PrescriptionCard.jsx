import { formatDate } from '../../utils/formatDate';
import { FiDownload, FiCalendar, FiUser } from 'react-icons/fi';

const PrescriptionCard = ({ prescription, onClick, isSelected }) => {
    return (
        <div
            onClick={() => onClick && onClick(prescription)}
            className={'bg-white rounded-xl border p-4 transition cursor-pointer ' + (isSelected ? 'border-primary-500 shadow-md' : 'border-gray-100 hover:border-primary-200 hover:shadow-sm')}
        >
            <div className="flex items-start gap-3">
                <img
                    src={prescription.doctor?.avatar || 'https://ui-avatars.com/api/?name=' + prescription.doctor?.name + '&background=0ea5e9&color=fff&size=80'}
                    alt={prescription.doctor?.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">Dr. {prescription.doctor?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <FiCalendar size={11} /> {formatDate(prescription.createdAt)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{prescription.diagnosis}</p>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">{prescription.medicines?.length || 0} medicines</span>
                {prescription.pdfUrl && (
                    <a
                        href={prescription.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 border border-primary-200 rounded-lg px-2.5 py-1 hover:bg-primary-50 transition"
                    >
                        <FiDownload size={12} /> PDF
                    </a>
                )}
            </div>
        </div>
    );
};

export default PrescriptionCard;