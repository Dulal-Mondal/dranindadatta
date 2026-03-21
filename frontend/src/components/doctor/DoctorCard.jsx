import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiClock } from 'react-icons/fi';
import { formatBDT } from '../../utils/formatCurrency';

const DoctorCard = ({ doctor }) => {
    const { user, specialization, experience, consultationFee, rating, totalReviews } = doctor;

    return (
        <div className="card hover:shadow-md transition group">
            {/* Avatar */}
            <div className="flex items-start gap-4">
                <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=0ea5e9&color=fff&size=128`}
                    alt={user?.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary-500 transition truncate">
                        Dr. {user?.name}
                    </h3>
                    <p className="text-sm text-primary-500 font-medium">{specialization}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <FiStar className="text-yellow-400 fill-yellow-400" size={13} />
                        <span className="text-sm font-medium text-gray-700">{rating?.toFixed(1) || '0.0'}</span>
                        <span className="text-xs text-gray-400">({totalReviews || 0} reviews)</span>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <FiClock size={12} /> {experience} yrs exp
                </span>
                <span className="flex items-center gap-1">
                    <FiMapPin size={12} /> Bangladesh
                </span>
            </div>

            {/* Fee + Book */}
            <div className="mt-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400">Consultation Fee</p>
                    <p className="text-lg font-bold text-gray-800">{formatBDT(consultationFee)}</p>
                </div>
                <Link
                    to={`/doctors/${user?._id}`}
                    className="btn-primary py-2 px-4 text-sm"
                >
                    Book Now
                </Link>
            </div>
        </div>
    );
};

export default DoctorCard;