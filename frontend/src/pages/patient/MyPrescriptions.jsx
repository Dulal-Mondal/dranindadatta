// import { useState, useEffect } from 'react';
// import Navbar from '../../components/common/Navbar';
// import Footer from '../../components/common/Footer';
// import Loader from '../../components/common/Loader';
// import { getMyPrescriptions } from '../../services/prescriptionService';
// import { formatDate } from '../../utils/formatDate';
// import toast from 'react-hot-toast';
// import { FiFileText, FiDownload, FiCalendar, FiUser } from 'react-icons/fi';

// const MyPrescriptions = () => {
//     const [prescriptions, setPrescriptions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selected, setSelected] = useState(null);

//     useEffect(() => {
//         fetchPrescriptions();
//     }, []);

//     const fetchPrescriptions = async () => {
//         try {
//             const { data } = await getMyPrescriptions();
//             setPrescriptions(data.prescriptions || []);
//         } catch (err) {
//             toast.error('Failed to load prescriptions');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Navbar />
//             <div className="max-w-6xl mx-auto px-4 py-8">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-6">My Prescriptions</h1>

//                 {loading ? (
//                     <Loader />
//                 ) : prescriptions.length === 0 ? (
//                     <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
//                         <FiFileText size={48} className="mx-auto mb-4 text-gray-300" />
//                         <p className="text-gray-500">No prescriptions yet</p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                         <div className="space-y-3">
//                             {prescriptions.map((pres) => (
//                                 <div
//                                     key={pres._id}
//                                     onClick={() => setSelected(pres)}
//                                     className={'bg-white rounded-xl border p-4 cursor-pointer transition ' + (selected?._id === pres._id ? 'border-primary-500 shadow-md' : 'border-gray-100 hover:border-primary-200 hover:shadow-sm')}
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
//                                             <FiFileText className="text-purple-500" size={18} />
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <p className="font-medium text-gray-800 text-sm truncate">Dr. {pres.doctor?.name}</p>
//                                             <p className="text-xs text-gray-500 mt-0.5">{formatDate(pres.createdAt)}</p>
//                                         </div>
//                                     </div>
//                                     <p className="text-xs text-gray-600 mt-2 truncate">{pres.diagnosis}</p>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="lg:col-span-2">
//                             {selected ? (
//                                 <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
//                                     <div className="flex items-center justify-between p-5 border-b border-gray-100">
//                                         <h2 className="font-semibold text-gray-800">Prescription Details</h2>
//                                         {selected.pdfUrl && (
//                                             <a
//                                                 href={selected.pdfUrl}
//                                                 target="_blank"
//                                                 rel="noreferrer"
//                                                 className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm px-4 py-2 rounded-lg transition"
//                                             >
//                                                 <FiDownload size={14} /> Download PDF
//                                             </a>
//                                         )}
//                                     </div>

//                                     <div className="p-5 space-y-5">
//                                         <div className="flex flex-wrap gap-4 text-sm text-gray-600">
//                                             <span className="flex items-center gap-1.5">
//                                                 <FiUser size={14} className="text-primary-500" />
//                                                 Dr. {selected.doctor?.name}
//                                             </span>
//                                             <span className="flex items-center gap-1.5">
//                                                 <FiCalendar size={14} className="text-primary-500" />
//                                                 {formatDate(selected.createdAt)}
//                                             </span>
//                                         </div>

//                                         <div>
//                                             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Diagnosis</p>
//                                             <p className="text-gray-800 bg-gray-50 rounded-lg p-3 text-sm">{selected.diagnosis}</p>
//                                         </div>

//                                         <div>
//                                             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Medicines</p>
//                                             <div className="space-y-2">
//                                                 {selected.medicines?.map((med, i) => (
//                                                     <div key={i} className="bg-blue-50 rounded-lg p-3">
//                                                         <div className="flex items-center justify-between">
//                                                             <p className="font-semibold text-gray-800 text-sm">{med.name}</p>
//                                                             <span className="text-xs bg-white text-primary-600 px-2 py-0.5 rounded-full border border-primary-100">{med.dosage}</span>
//                                                         </div>
//                                                         <p className="text-xs text-gray-600 mt-1">{med.frequency} · {med.duration}</p>
//                                                         {med.notes && <p className="text-xs text-gray-400 mt-0.5">{med.notes}</p>}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>

//                                         {selected.tests?.length > 0 && (
//                                             <div>
//                                                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tests</p>
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {selected.tests.map((test, i) => (
//                                                         <span key={i} className="bg-orange-50 text-orange-600 text-xs px-3 py-1 rounded-full">{test}</span>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {selected.advice && (
//                                             <div>
//                                                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Advice</p>
//                                                 <p className="text-gray-700 text-sm bg-green-50 rounded-lg p-3">{selected.advice}</p>
//                                             </div>
//                                         )}

//                                         {selected.followUpDate && (
//                                             <div className="bg-yellow-50 rounded-lg p-3 flex items-center gap-2">
//                                                 <FiCalendar className="text-yellow-500" size={16} />
//                                                 <p className="text-sm text-yellow-700">
//                                                     Follow-up: <span className="font-semibold">{formatDate(selected.followUpDate)}</span>
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="bg-white rounded-xl border border-gray-100 h-64 flex items-center justify-center text-gray-400">
//                                     <div className="text-center">
//                                         <FiFileText size={40} className="mx-auto mb-3 opacity-30" />
//                                         <p className="text-sm">Select a prescription to view details</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default MyPrescriptions;




import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { getMyPrescriptions } from '../../services/prescriptionService';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { FiFileText, FiDownload, FiCalendar, FiUser } from 'react-icons/fi';

const MyPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const { data } = await getMyPrescriptions();
            setPrescriptions(data.prescriptions || []);
        } catch (err) {
            toast.error('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Prescriptions</h1>

                {loading ? (
                    <Loader />
                ) : prescriptions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <FiFileText size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">No prescriptions yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            {prescriptions.map((pres) => (
                                <div
                                    key={pres._id}
                                    onClick={() => setSelected(pres)}
                                    className={'bg-white rounded-xl border p-4 cursor-pointer transition ' + (selected?._id === pres._id ? 'border-primary-500 shadow-md' : 'border-gray-100 hover:border-primary-200 hover:shadow-sm')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                                            <FiFileText className="text-purple-500" size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 text-sm truncate">Dr. {pres.doctor?.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{formatDate(pres.createdAt)}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2 truncate">{pres.diagnosis}</p>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-2">
                            {selected ? (
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                        <h2 className="font-semibold text-gray-800">Prescription Details</h2>
                                        {selected.pdfUrl && (
                                            <a
                                                href={selected.pdfUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm px-4 py-2 rounded-lg transition"
                                            >
                                                <FiDownload size={14} /> Download PDF
                                            </a>
                                        )}
                                    </div>

                                    <div className="p-5 space-y-5">
                                        {/* Doctor, Date, Age, Sex */}
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1.5">
                                                <FiUser size={14} className="text-primary-500" />
                                                Dr. {selected.doctor?.name}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FiCalendar size={14} className="text-primary-500" />
                                                {formatDate(selected.createdAt)}
                                            </span>
                                            {/* ✅ Age */}
                                            {selected.patientAge && (
                                                <span className="flex items-center gap-1.5">
                                                    <FiUser size={14} className="text-primary-500" />
                                                    Age: <span className="font-medium text-gray-800">{selected.patientAge} yrs</span>
                                                </span>
                                            )}
                                            {/* ✅ Sex */}
                                            {selected.patientSex && (
                                                <span className="flex items-center gap-1.5">
                                                    <FiUser size={14} className="text-primary-500" />
                                                    Sex: <span className="font-medium text-gray-800">{selected.patientSex}</span>
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Diagnosis</p>
                                            <p className="text-gray-800 bg-gray-50 rounded-lg p-3 text-sm">{selected.diagnosis}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Medicines</p>
                                            <div className="space-y-2">
                                                {selected.medicines?.map((med, i) => (
                                                    <div key={i} className="bg-blue-50 rounded-lg p-3">
                                                        <div className="flex items-center justify-between">
                                                            <p className="font-semibold text-gray-800 text-sm">{med.name}</p>
                                                            <span className="text-xs bg-white text-primary-600 px-2 py-0.5 rounded-full border border-primary-100">{med.dosage}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">{med.frequency} · {med.duration}</p>
                                                        {med.notes && <p className="text-xs text-gray-400 mt-0.5">{med.notes}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {selected.tests?.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tests</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selected.tests.map((test, i) => (
                                                        <span key={i} className="bg-orange-50 text-orange-600 text-xs px-3 py-1 rounded-full">{test}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selected.advice && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Advice</p>
                                                <p className="text-gray-700 text-sm bg-green-50 rounded-lg p-3">{selected.advice}</p>
                                            </div>
                                        )}

                                        {selected.followUpDate && (
                                            <div className="bg-yellow-50 rounded-lg p-3 flex items-center gap-2">
                                                <FiCalendar className="text-yellow-500" size={16} />
                                                <p className="text-sm text-yellow-700">
                                                    Follow-up: <span className="font-semibold">{formatDate(selected.followUpDate)}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-100 h-64 flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <FiFileText size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="text-sm">Select a prescription to view details</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyPrescriptions;