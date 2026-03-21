// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Navbar from '../../components/common/Navbar';
// import Footer from '../../components/common/Footer';
// import Loader from '../../components/common/Loader';
// import { getDoctorById } from '../../services/doctorService';
// import { useAuth } from '../../context/AuthContext';
// import { formatBDT } from '../../utils/formatCurrency';
// import toast from 'react-hot-toast';
// import {
//     FiStar, FiClock, FiMessageSquare, FiVideo,
//     FiX, FiChevronLeft, FiChevronRight, FiCalendar,
// } from 'react-icons/fi';

// const DoctorDetail = () => {
//     const { id } = useParams();
//     const { user } = useAuth();
//     const navigate = useNavigate();

//     const [doctor, setDoctor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('about');
//     const [lightbox, setLightbox] = useState({ open: false, index: 0 });

//     useEffect(() => {
//         fetchDoctor();
//     }, [id]);

//     const fetchDoctor = async () => {
//         try {
//             const { data } = await getDoctorById(id);
//             setDoctor(data.doctor);
//         } catch (err) {
//             toast.error('Doctor not found');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleBook = () => {
//         if (!user) {
//             toast.error('Please login to book an appointment');
//             navigate('/login');
//             return;
//         }
//         if (user.role !== 'patient') {
//             toast.error('Only patients can book appointments');
//             return;
//         }
//         navigate('/patient/book/' + id);
//     };

//     const handleChat = () => {
//         if (!user) {
//             navigate('/login');
//             return;
//         }
//         navigate('/patient/chat/' + id);
//     };

//     const openLightbox = (index) => setLightbox({ open: true, index });
//     const closeLightbox = () => setLightbox({ open: false, index: 0 });

//     const prevImage = () => {
//         setLightbox((prev) => ({
//             ...prev,
//             index: prev.index === 0 ? doctor.images.length - 1 : prev.index - 1,
//         }));
//     };

//     const nextImage = () => {
//         setLightbox((prev) => ({
//             ...prev,
//             index: prev.index === doctor.images.length - 1 ? 0 : prev.index + 1,
//         }));
//     };

//     if (loading) return <><Navbar /><Loader fullScreen /></>;

//     if (!doctor) return (
//         <><Navbar />
//             <div className="text-center py-20 text-gray-500">Doctor not found</div>
//             <Footer /></>
//     );

//     const tabs = ['about', 'gallery', 'videos', 'schedule'];

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Navbar />

//             {/* Hero */}
//             <div className="bg-white border-b border-gray-100">
//                 <div className="max-w-5xl mx-auto px-4 py-8">
//                     <div className="flex flex-col md:flex-row gap-6 items-start">

//                         <img
//                             src={doctor.user?.avatar || 'https://ui-avatars.com/api/?name=' + doctor.user?.name + '&background=0ea5e9&color=fff&size=200'}
//                             alt={doctor.user?.name}
//                             className="w-28 h-28 rounded-2xl object-cover shrink-0 shadow-md"
//                         />

//                         <div className="flex-1">
//                             <h1 className="text-2xl font-bold text-gray-800">Dr. {doctor.user?.name}</h1>
//                             <p className="text-primary-500 font-medium mt-1">{doctor.specialization}</p>

//                             <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
//                                 <span className="flex items-center gap-1">
//                                     <FiStar className="text-yellow-400" />
//                                     {doctor.rating?.toFixed(1) || '0.0'} ({doctor.totalReviews || 0} reviews)
//                                 </span>
//                                 <span className="flex items-center gap-1">
//                                     <FiClock size={14} />
//                                     {doctor.experience} years experience
//                                 </span>
//                             </div>

//                             <div className="flex flex-wrap gap-2 mt-3">
//                                 {doctor.qualifications?.map((q, i) => (
//                                     <span key={i} className="bg-primary-50 text-primary-600 text-xs px-3 py-1 rounded-full font-medium">
//                                         {q}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="bg-gray-50 rounded-2xl p-5 min-w-[220px] border border-gray-100">
//                             <p className="text-sm text-gray-500 mb-1">Consultation Fee</p>
//                             <p className="text-3xl font-bold text-gray-800 mb-4">{formatBDT(doctor.consultationFee)}</p>

//                             <button
//                                 onClick={handleBook}
//                                 className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2 mb-2"
//                             >
//                                 <FiVideo size={16} /> Book Video Call
//                             </button>

//                             <button
//                                 onClick={handleChat}
//                                 className="w-full border border-primary-500 text-primary-500 hover:bg-primary-50 font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2"
//                             >
//                                 <FiMessageSquare size={16} /> Free Chat
//                             </button>
//                         </div>
//                     </div>

//                     {/* Tabs */}
//                     <div className="flex gap-1 mt-6 border-b border-gray-100">
//                         {tabs.map((tab) => (
//                             <button
//                                 key={tab}
//                                 onClick={() => setActiveTab(tab)}
//                                 className={'px-5 py-2.5 text-sm font-medium capitalize transition border-b-2 ' + (activeTab === tab ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-500 hover:text-gray-700')}
//                             >
//                                 {tab}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Tab Content */}
//             <div className="max-w-5xl mx-auto px-4 py-8">

//                 {/* About */}
//                 {activeTab === 'about' && (
//                     <div className="space-y-6">
//                         <div className="bg-white rounded-xl p-6 border border-gray-100">
//                             <h3 className="font-semibold text-gray-800 mb-3">About</h3>
//                             <p className="text-gray-600 leading-relaxed">
//                                 {doctor.bio || 'No bio available for this doctor.'}
//                             </p>
//                         </div>

//                         <div className="bg-white rounded-xl p-6 border border-gray-100">
//                             <h3 className="font-semibold text-gray-800 mb-4">Specializations & Qualifications</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <p className="text-sm text-gray-500 mb-2">Specialization</p>
//                                     <p className="font-medium text-gray-800">{doctor.specialization}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-500 mb-2">Experience</p>
//                                     <p className="font-medium text-gray-800">{doctor.experience} years</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-500 mb-2">Qualifications</p>
//                                     <div className="flex flex-wrap gap-2">
//                                         {doctor.qualifications?.length > 0 ? (
//                                             doctor.qualifications.map((q, i) => (
//                                                 <span key={i} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-lg">{q}</span>
//                                             ))
//                                         ) : (
//                                             <span className="text-gray-400 text-sm">Not specified</span>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Image Gallery */}
//                 {activeTab === 'gallery' && (
//                     <div className="bg-white rounded-xl p-6 border border-gray-100">
//                         <h3 className="font-semibold text-gray-800 mb-4">
//                             Photo Gallery
//                             <span className="text-sm font-normal text-gray-400 ml-2">({doctor.images?.length || 0} photos)</span>
//                         </h3>

//                         {!doctor.images || doctor.images.length === 0 ? (
//                             <div className="text-center py-16 text-gray-400">
//                                 <p className="text-4xl mb-3">🖼️</p>
//                                 <p>No images uploaded yet</p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//                                 {doctor.images.map((img, i) => (
//                                     <div
//                                         key={i}
//                                         onClick={() => openLightbox(i)}
//                                         className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
//                                     >
//                                         <img
//                                             src={img}
//                                             alt={'Gallery ' + (i + 1)}
//                                             className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
//                                         />
//                                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Videos */}
//                 {activeTab === 'videos' && (
//                     <div className="bg-white rounded-xl p-6 border border-gray-100">
//                         <h3 className="font-semibold text-gray-800 mb-4">
//                             Videos
//                             <span className="text-sm font-normal text-gray-400 ml-2">({doctor.videos?.length || 0} videos)</span>
//                         </h3>

//                         {!doctor.videos || doctor.videos.length === 0 ? (
//                             <div className="text-center py-16 text-gray-400">
//                                 <p className="text-4xl mb-3">🎬</p>
//                                 <p>No videos uploaded yet</p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {doctor.videos.map((video, i) => (
//                                     <div key={i} className="rounded-xl overflow-hidden bg-black">
//                                         <video
//                                             src={video}
//                                             controls
//                                             className="w-full aspect-video object-cover"
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Schedule */}
//                 {activeTab === 'schedule' && (
//                     <div className="bg-white rounded-xl p-6 border border-gray-100">
//                         <h3 className="font-semibold text-gray-800 mb-4">Available Schedule</h3>

//                         {!doctor.availableSlots || doctor.availableSlots.length === 0 ? (
//                             <div className="text-center py-16 text-gray-400">
//                                 <p className="text-4xl mb-3">📅</p>
//                                 <p>No schedule set yet</p>
//                             </div>
//                         ) : (
//                             <div className="space-y-3">
//                                 {doctor.availableSlots.map((slot, i) => (
//                                     <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//                                         <div className="flex items-center gap-3">
//                                             <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
//                                                 <FiCalendar className="text-primary-500" size={18} />
//                                             </div>
//                                             <p className="font-medium text-gray-800">{slot.day}</p>
//                                         </div>
//                                         <p className="text-sm text-gray-600 bg-white px-4 py-1.5 rounded-lg border border-gray-100">
//                                             {slot.startTime} — {slot.endTime}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         <button
//                             onClick={handleBook}
//                             className="w-full mt-6 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
//                         >
//                             <FiCalendar size={16} /> Book Appointment Now
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* Lightbox */}
//             {lightbox.open && doctor.images?.length > 0 && (
//                 <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
//                     <button
//                         onClick={closeLightbox}
//                         className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
//                     >
//                         <FiX size={20} />
//                     </button>

//                     <button
//                         onClick={prevImage}
//                         className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
//                     >
//                         <FiChevronLeft size={20} />
//                     </button>

//                     <div className="max-w-3xl max-h-[80vh] px-16">
//                         <img
//                             src={doctor.images[lightbox.index]}
//                             alt={'Image ' + (lightbox.index + 1)}
//                             className="max-w-full max-h-[80vh] object-contain rounded-xl"
//                         />
//                         <p className="text-center text-white/60 text-sm mt-3">
//                             {lightbox.index + 1} / {doctor.images.length}
//                         </p>
//                     </div>

//                     <button
//                         onClick={nextImage}
//                         className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
//                     >
//                         <FiChevronRight size={20} />
//                     </button>
//                 </div>
//             )}

//             <Footer />
//         </div>
//     );
// };

// export default DoctorDetail;


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { getDoctorById } from '../../services/doctorService';
import { useAuth } from '../../context/AuthContext';
import { formatBDT } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';
import {
    FiStar, FiClock, FiMessageSquare, FiVideo,
    FiX, FiChevronLeft, FiChevronRight, FiCalendar,
} from 'react-icons/fi';

const DoctorDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [lightbox, setLightbox] = useState({ open: false, index: 0 });

    useEffect(() => {
        fetchDoctor();
    }, [id]);

    const fetchDoctor = async () => {
        try {
            const { data } = await getDoctorById(id);
            setDoctor(data.doctor);
        } catch (err) {
            toast.error('Doctor not found');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = () => {
        if (!user) {
            toast.error('Please login to book an appointment');
            navigate('/login');
            return;
        }
        if (user.role !== 'patient') {
            toast.error('Only patients can book appointments');
            return;
        }
        navigate('/patient/book/' + id);
    };

    const handleChat = () => {
        if (!user) {
            toast.error('Please login to chat');
            navigate('/login');
            return;
        }
        if (user.role !== 'patient') {
            toast.error('Only patients can chat with doctors');
            return;
        }
        // appointment na niyei chat korte parbe
        navigate('/patient/chat/' + id);
    };

    const openLightbox = (index) => setLightbox({ open: true, index });
    const closeLightbox = () => setLightbox({ open: false, index: 0 });

    const prevImage = () => {
        setLightbox((prev) => ({
            ...prev,
            index: prev.index === 0 ? doctor.images.length - 1 : prev.index - 1,
        }));
    };

    const nextImage = () => {
        setLightbox((prev) => ({
            ...prev,
            index: prev.index === doctor.images.length - 1 ? 0 : prev.index + 1,
        }));
    };

    if (loading) return <><Navbar /><Loader fullScreen /></>;

    if (!doctor) return (
        <><Navbar />
            <div className="text-center py-20 text-gray-500">Doctor not found</div>
            <Footer /></>
    );

    const tabs = ['about', 'gallery', 'videos', 'schedule'];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">

                        <img
                            src={doctor.user?.avatar || 'https://ui-avatars.com/api/?name=' + doctor.user?.name + '&background=0ea5e9&color=fff&size=200'}
                            alt={doctor.user?.name}
                            className="w-28 h-28 rounded-2xl object-cover shrink-0 shadow-md"
                        />

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800">Dr. {doctor.user?.name}</h1>
                            <p className="text-primary-500 font-medium mt-1">{doctor.specialization}</p>

                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <FiStar className="text-yellow-400" />
                                    {doctor.rating?.toFixed(1) || '0.0'} ({doctor.totalReviews || 0} reviews)
                                </span>
                                <span className="flex items-center gap-1">
                                    <FiClock size={14} />
                                    {doctor.experience} years experience
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {doctor.qualifications?.map((q, i) => (
                                    <span key={i} className="bg-primary-50 text-primary-600 text-xs px-3 py-1 rounded-full font-medium">
                                        {q}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-5 min-w-[220px] border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Consultation Fee</p>
                            <p className="text-3xl font-bold text-gray-800 mb-1">{formatBDT(doctor.consultationFee)}</p>
                            <p className="text-xs text-gray-400 mb-4">For video consultation</p>

                            <button
                                onClick={handleBook}
                                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2 mb-2"
                            >
                                <FiVideo size={16} /> Book Video Call
                            </button>

                            <button
                                onClick={handleChat}
                                className="w-full border border-primary-500 text-primary-500 hover:bg-primary-50 font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                            >
                                <FiMessageSquare size={16} /> Free Chat
                            </button>

                            <p className="text-xs text-green-600 text-center mt-2">✓ Chat is completely free</p>
                        </div>
                    </div>

                    <div className="flex gap-1 mt-6 border-b border-gray-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={'px-5 py-2.5 text-sm font-medium capitalize transition border-b-2 ' + (activeTab === tab ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-500 hover:text-gray-700')}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">

                {activeTab === 'about' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-3">About</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {doctor.bio || 'No bio available for this doctor.'}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-4">Specializations & Qualifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Specialization</p>
                                    <p className="font-medium text-gray-800">{doctor.specialization}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Experience</p>
                                    <p className="font-medium text-gray-800">{doctor.experience} years</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Qualifications</p>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.qualifications?.length > 0 ? (
                                            doctor.qualifications.map((q, i) => (
                                                <span key={i} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-lg">{q}</span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm">Not specified</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-4">
                            Photo Gallery
                            <span className="text-sm font-normal text-gray-400 ml-2">({doctor.images?.length || 0} photos)</span>
                        </h3>

                        {!doctor.images || doctor.images.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <p className="text-4xl mb-3">🖼️</p>
                                <p>No images uploaded yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {doctor.images.map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => openLightbox(i)}
                                        className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
                                    >
                                        <img
                                            src={img}
                                            alt={'Gallery ' + (i + 1)}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'videos' && (
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-4">
                            Videos
                            <span className="text-sm font-normal text-gray-400 ml-2">({doctor.videos?.length || 0} videos)</span>
                        </h3>

                        {!doctor.videos || doctor.videos.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <p className="text-4xl mb-3">🎬</p>
                                <p>No videos uploaded yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {doctor.videos.map((video, i) => (
                                    <div key={i} className="rounded-xl overflow-hidden bg-black">
                                        <video src={video} controls className="w-full aspect-video object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Available Schedule</h3>

                        {!doctor.availableSlots || doctor.availableSlots.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <p className="text-4xl mb-3">📅</p>
                                <p>No schedule set yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {doctor.availableSlots.map((slot, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                                                <FiCalendar className="text-primary-500" size={18} />
                                            </div>
                                            <p className="font-medium text-gray-800">{slot.day}</p>
                                        </div>
                                        <p className="text-sm text-gray-600 bg-white px-4 py-1.5 rounded-lg border border-gray-100">
                                            {slot.startTime} — {slot.endTime}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleBook}
                            className="w-full mt-6 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
                        >
                            <FiCalendar size={16} /> Book Video Appointment
                        </button>
                    </div>
                )}
            </div>

            {lightbox.open && doctor.images?.length > 0 && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                    <button onClick={closeLightbox} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition">
                        <FiX size={20} />
                    </button>
                    <button onClick={prevImage} className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition">
                        <FiChevronLeft size={20} />
                    </button>
                    <div className="max-w-3xl max-h-[80vh] px-16">
                        <img src={doctor.images[lightbox.index]} alt={'Image ' + (lightbox.index + 1)} className="max-w-full max-h-[80vh] object-contain rounded-xl" />
                        <p className="text-center text-white/60 text-sm mt-3">{lightbox.index + 1} / {doctor.images.length}</p>
                    </div>
                    <button onClick={nextImage} className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition">
                        <FiChevronRight size={20} />
                    </button>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default DoctorDetail;