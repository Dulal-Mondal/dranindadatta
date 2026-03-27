// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Navbar from '../../components/common/Navbar';
// import Footer from '../../components/common/Footer';
// import Loader from '../../components/common/Loader';
// import { getAllDoctors } from '../../services/doctorService';
// import { SPECIALIZATIONS } from '../../utils/constants';
// import { formatBDT } from '../../utils/formatCurrency';
// import { FiSearch, FiStar, FiClock, FiFilter } from 'react-icons/fi';
// import usePageTitle from '../../hooks/usePageTitle';
// const DoctorList = () => {
//     const [doctors, setDoctors] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [search, setSearch] = useState('');
//     const [specialization, setSpecialization] = useState('');
//     const [page, setPage] = useState(1);
//     const [total, setTotal] = useState(0);

//     usePageTitle('Find Doctors');

//     useEffect(() => {
//         fetchDoctors();
//     }, [search, specialization, page]);

//     const fetchDoctors = async () => {
//         setLoading(true);
//         try {
//             const { data } = await getAllDoctors({ search, specialization, page, limit: 9 });
//             setDoctors(data.doctors || []);
//             setTotal(data.total || 0);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Navbar />

//             <div className="bg-gradient-to-r from-primary-500 to-blue-600 py-12 px-4">
//                 <div className="max-w-7xl mx-auto text-center text-white">
//                     <h1 className="text-3xl md:text-4xl font-bold mb-3">Find Your Doctor</h1>
//                     <p className="text-blue-100 mb-8">Choose from 500+ experienced specialists</p>
//                     <div className="max-w-2xl mx-auto flex gap-3">
//                         <div className="flex-1 relative">
//                             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                             <input
//                                 type="text"
//                                 placeholder="Search by doctor name..."
//                                 value={search}
//                                 onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//                                 className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
//                             />
//                         </div>
//                         <select
//                             value={specialization}
//                             onChange={(e) => { setSpecialization(e.target.value); setPage(1); }}
//                             className="px-4 py-3 rounded-xl text-gray-800 focus:outline-none bg-white"
//                         >
//                             <option value="">All Specializations</option>
//                             {SPECIALIZATIONS.map((s) => (
//                                 <option key={s} value={s}>{s}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//             </div>

//             <div className="max-w-7xl mx-auto px-4 py-10">
//                 <div className="flex items-center justify-between mb-6">
//                     <p className="text-gray-500 text-sm">
//                         Showing <span className="font-semibold text-gray-800">{doctors.length}</span> of {total} doctors
//                     </p>
//                 </div>

//                 {loading ? (
//                     <Loader />
//                 ) : doctors.length === 0 ? (
//                     <div className="text-center py-20">
//                         <p className="text-5xl mb-4">🔍</p>
//                         <p className="text-gray-500">No doctors found</p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {doctors.map((doctor) => (
//                             <DoctorCard key={doctor._id} doctor={doctor} />
//                         ))}
//                     </div>
//                 )}

//                 {total > 9 && (
//                     <div className="flex justify-center gap-2 mt-10">
//                         {Array.from({ length: Math.ceil(total / 9) }, (_, i) => (
//                             <button
//                                 key={i}
//                                 onClick={() => setPage(i + 1)}
//                                 className={`w-10 h-10 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
//                             >
//                                 {i + 1}
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             <Footer />
//         </div>
//     );
// };

// const DoctorCard = ({ doctor }) => {
//     const { user, specialization, experience, consultationFee, rating, totalReviews } = doctor;

//     return (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition group">
//             <div className="flex items-start gap-4">
//                 <img
//                     src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name + '&background=0ea5e9&color=fff&size=128'}
//                     alt={user?.name}
//                     className="w-16 h-16 rounded-2xl object-cover shrink-0"
//                 />
//                 <div className="flex-1 min-w-0">
//                     <h3 className="font-semibold text-gray-800 group-hover:text-primary-500 transition truncate">
//                         Dr. {user?.name}
//                     </h3>
//                     <p className="text-sm text-primary-500 font-medium">{specialization}</p>
//                     <div className="flex items-center gap-1 mt-1">
//                         <FiStar className="text-yellow-400" size={13} />
//                         <span className="text-sm font-medium text-gray-700">{rating?.toFixed(1) || '0.0'}</span>
//                         <span className="text-xs text-gray-400">({totalReviews || 0})</span>
//                     </div>
//                 </div>
//             </div>

//             <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
//                 <span className="flex items-center gap-1">
//                     <FiClock size={12} /> {experience} yrs exp
//                 </span>
//             </div>

//             <div className="mt-4 flex items-center justify-between">
//                 <div>
//                     <p className="text-xs text-gray-400">Consultation Fee</p>
//                     <p className="text-lg font-bold text-gray-800">{formatBDT(consultationFee)}</p>
//                 </div>
//                 <Link
//                     to={'/doctors/' + user?._id}
//                     className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
//                 >
//                     Book Now
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default DoctorList;


import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import DoctorCard from '../../components/doctor/DoctorCard';
import { getAllDoctors } from '../../services/doctorService';
import { SPECIALIZATIONS } from '../../utils/constants';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { motion } from "framer-motion";
import HeroSection from '../../components/common/HeroSection';


const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchDoctors();
    }, [search, specialization, page]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const { data } = await getAllDoctors({ search, specialization, page, limit: 9 });
            setDoctors(data.doctors || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero */}
            {/* <div className="bg-gradient-to-r from-primary-500 to-blue-600 py-14 px-4">
                <div className="max-w-7xl mx-auto text-center text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-3">Find Your Doctor</h1>
                    <p className="text-blue-100 mb-10 text-lg">Choose from experienced specialists</p>

                    <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by doctor name..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white text-sm"
                            />
                        </div>
                        <div className="relative">
                            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                value={specialization}
                                onChange={(e) => { setSpecialization(e.target.value); setPage(1); }}
                                className="pl-10 pr-6 py-3.5 rounded-xl text-gray-800 focus:outline-none bg-white text-sm min-w-[200px]"
                            >
                                <option value="">All Specializations</option>
                                {SPECIALIZATIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div> */}

            <HeroSection
                search={search}
                setSearch={setSearch}
                specialization={specialization}
                setSpecialization={setSpecialization}
                setPage={setPage}
                SPECIALIZATIONS={SPECIALIZATIONS}
            />

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-500 text-sm">
                        Showing <span className="font-semibold text-gray-800">{doctors.length}</span> of {total} doctors
                    </p>
                    {specialization && (
                        <button
                            onClick={() => setSpecialization('')}
                            className="text-xs text-primary-500 hover:underline"
                        >
                            Clear filter
                        </button>
                    )}
                </div>

                {loading ? (
                    <Loader />
                ) : doctors.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-5xl mb-4">🔍</p>
                        <p className="text-gray-500 font-medium">No doctors found</p>
                        <p className="text-gray-400 text-sm mt-1">Try changing your search or filter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <DoctorCard key={doctor._id} doctor={doctor} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {total > 9 && (
                    <div className="flex justify-center gap-2 mt-10">
                        {Array.from({ length: Math.ceil(total / 9) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={'w-10 h-10 rounded-xl text-sm font-medium transition ' + (page === i + 1 ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200')}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default DoctorList;