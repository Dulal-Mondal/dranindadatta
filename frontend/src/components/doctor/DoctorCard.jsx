// import { Link } from 'react-router-dom';
// import { FiStar, FiMapPin, FiClock } from 'react-icons/fi';
// import { formatBDT } from '../../utils/formatCurrency';

// const DoctorCard = ({ doctor }) => {
//     const { user, specialization, experience, consultationFee, rating, totalReviews } = doctor;

//     return (
//         <div className="card hover:shadow-md transition group">
//             {/* Avatar */}
//             <div className="flex items-start gap-4">
//                 <img
//                     src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=0ea5e9&color=fff&size=128`}
//                     alt={user?.name}
//                     className="w-16 h-16 rounded-2xl object-cover shrink-0"
//                 />
//                 <div className="flex-1 min-w-0">
//                     <h3 className="font-semibold text-gray-800 group-hover:text-primary-500 transition truncate">
//                         Dr. {user?.name}
//                     </h3>
//                     <p className="text-sm text-primary-500 font-medium">{specialization}</p>
//                     <div className="flex items-center gap-1 mt-1">
//                         <FiStar className="text-yellow-400 fill-yellow-400" size={13} />
//                         <span className="text-sm font-medium text-gray-700">{rating?.toFixed(1) || '0.0'}</span>
//                         <span className="text-xs text-gray-400">({totalReviews || 0} reviews)</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Info */}
//             <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
//                 <span className="flex items-center gap-1">
//                     <FiClock size={12} /> {experience} yrs exp
//                 </span>
//                 <span className="flex items-center gap-1">
//                     <FiMapPin size={12} /> Bangladesh
//                 </span>
//             </div>

//             {/* Fee + Book */}
//             <div className="mt-4 flex items-center justify-between">
//                 <div>
//                     <p className="text-xs text-gray-400">Consultation Fee</p>
//                     <p className="text-lg font-bold text-gray-800">{formatBDT(consultationFee)}</p>
//                 </div>
//                 <Link
//                     to={`/doctors/${user?._id}`}
//                     className="btn-primary py-2 px-4 text-sm"
//                 >
//                     Book Now
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default DoctorCard;




import { Link } from 'react-router-dom';
import { FiStar, FiClock, FiMessageSquare, FiVideo } from 'react-icons/fi';
import { formatBDT } from '../../utils/formatCurrency';

const DoctorCard = ({ doctor }) => {
    const { user, specialization, experience, consultationFee, rating, totalReviews, bio } = doctor;

    return (
        <Link
            to={'/doctors/' + user?._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden block"
        >
            {/* Top color bar */}
            <div className="h-2 bg-gradient-to-r from-primary-500 to-blue-400" />

            <div className="p-6">
                {/* Avatar + Info */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="relative shrink-0">
                        <img
                            src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name + '&background=0ea5e9&color=fff&size=128'}
                            alt={user?.name}
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-100 group-hover:border-primary-400 transition"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary-500 transition truncate">
                            Dr. {user?.name}
                        </h3>
                        <p className="text-primary-500 font-medium text-sm mt-0.5">{specialization}</p>
                        <div className="flex items-center gap-1 mt-1.5">
                            <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
                            <span className="text-sm font-semibold text-gray-700">{rating?.toFixed(1) || '0.0'}</span>
                            <span className="text-xs text-gray-400">({totalReviews || 0} reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                {bio && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                        {bio}
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5">
                        <FiClock size={14} className="text-primary-400" />
                        <span>{experience} yrs exp</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200" />
                    <div className="flex items-center gap-1.5">
                        <span className="text-green-500 font-medium">Available</span>
                    </div>
                </div>

                {/* Fee + Buttons */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400">Consultation Fee</p>
                        <p className="text-xl font-bold text-gray-800">{formatBDT(consultationFee)}</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-9 h-9 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition">
                            <FiMessageSquare size={16} />
                        </div>
                        <div className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition">
                            <FiVideo size={14} />
                            Book Now
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default DoctorCard;