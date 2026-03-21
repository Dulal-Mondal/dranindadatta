// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Navbar from '../../components/common/Navbar';
// import Footer from '../../components/common/Footer';
// import { createPrescription } from '../../services/prescriptionService';
// import toast from 'react-hot-toast';
// import { FiPlus, FiTrash2, FiSend } from 'react-icons/fi';
// import api from '../../services/api';

// const WritePrescription = () => {
//     const { appointmentId } = useParams();
//     const navigate = useNavigate();

//     const [appointment, setAppointment] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const [form, setForm] = useState({
//         diagnosis: '',
//         advice: '',
//         followUpDate: '',
//         tests: [],
//         medicines: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }],
//     });

//     const [testInput, setTestInput] = useState('');

//     useEffect(() => {
//         fetchAppointment();
//     }, [appointmentId]);

//     const fetchAppointment = async () => {
//         try {
//             const { data } = await api.get('/appointments/doctor');
//             const apt = data.appointments.find((a) => a._id === appointmentId);
//             setAppointment(apt);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const addMedicine = () => {
//         setForm({
//             ...form,
//             medicines: [...form.medicines, { name: '', dosage: '', frequency: '', duration: '', notes: '' }],
//         });
//     };

//     const removeMedicine = (index) => {
//         setForm({
//             ...form,
//             medicines: form.medicines.filter((_, i) => i !== index),
//         });
//     };

//     const updateMedicine = (index, field, value) => {
//         const updated = [...form.medicines];
//         updated[index][field] = value;
//         setForm({ ...form, medicines: updated });
//     };

//     const addTest = () => {
//         if (!testInput.trim()) return;
//         setForm({ ...form, tests: [...form.tests, testInput.trim()] });
//         setTestInput('');
//     };

//     const removeTest = (index) => {
//         setForm({ ...form, tests: form.tests.filter((_, i) => i !== index) });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!form.diagnosis) return toast.error('Diagnosis is required');
//         if (form.medicines.some((m) => !m.name)) return toast.error('Fill all medicine names');

//         setLoading(true);
//         try {
//             await createPrescription({
//                 appointmentId,
//                 patientId: appointment?.patient?._id,
//                 ...form,
//             });
//             toast.success('Prescription sent to patient!');
//             navigate('/doctor/appointments');
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to create prescription');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Navbar />
//             <div className="max-w-3xl mx-auto px-4 py-8">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-2">Write Prescription</h1>
//                 {appointment && (
//                     <p className="text-gray-500 text-sm mb-6">Patient: {appointment.patient?.name}</p>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-5">

//                     <div className="bg-white rounded-xl border border-gray-100 p-5">
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnosis *</label>
//                         <textarea
//                             value={form.diagnosis}
//                             onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
//                             placeholder="Enter diagnosis..."
//                             rows={3}
//                             required
//                             className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
//                         />
//                     </div>

//                     <div className="bg-white rounded-xl border border-gray-100 p-5">
//                         <div className="flex items-center justify-between mb-3">
//                             <label className="text-sm font-semibold text-gray-700">Medicines *</label>
//                             <button type="button" onClick={addMedicine} className="flex items-center gap-1 text-primary-500 hover:text-primary-600 text-sm font-medium">
//                                 <FiPlus size={16} /> Add Medicine
//                             </button>
//                         </div>
//                         <div className="space-y-4">
//                             {form.medicines.map((med, i) => (
//                                 <div key={i} className="bg-gray-50 rounded-xl p-4">
//                                     <div className="flex items-center justify-between mb-3">
//                                         <p className="text-sm font-medium text-gray-600">Medicine {i + 1}</p>
//                                         {form.medicines.length > 1 && (
//                                             <button type="button" onClick={() => removeMedicine(i)} className="text-red-400 hover:text-red-500">
//                                                 <FiTrash2 size={15} />
//                                             </button>
//                                         )}
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-3">
//                                         <div className="col-span-2">
//                                             <input
//                                                 type="text"
//                                                 placeholder="Medicine name *"
//                                                 value={med.name}
//                                                 onChange={(e) => updateMedicine(i, 'name', e.target.value)}
//                                                 required
//                                                 className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
//                                             />
//                                         </div>
//                                         <input
//                                             type="text"
//                                             placeholder="Dosage (e.g. 500mg)"
//                                             value={med.dosage}
//                                             onChange={(e) => updateMedicine(i, 'dosage', e.target.value)}
//                                             className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
//                                         />
//                                         <input
//                                             type="text"
//                                             placeholder="Frequency (e.g. twice daily)"
//                                             value={med.frequency}
//                                             onChange={(e) => updateMedicine(i, 'frequency', e.target.value)}
//                                             className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
//                                         />
//                                         <input
//                                             type="text"
//                                             placeholder="Duration (e.g. 7 days)"
//                                             value={med.duration}
//                                             onChange={(e) => updateMedicine(i, 'duration', e.target.value)}
//                                             className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
//                                         />
//                                         <input
//                                             type="text"
//                                             placeholder="Notes (optional)"
//                                             value={med.notes}
//                                             onChange={(e) => updateMedicine(i, 'notes', e.target.value)}
//                                             className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
//                                         />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl border border-gray-100 p-5">
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">Tests / Investigations</label>
//                         <div className="flex gap-2 mb-3">
//                             <input
//                                 type="text"
//                                 value={testInput}
//                                 onChange={(e) => setTestInput(e.target.value)}
//                                 onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTest())}
//                                 placeholder="e.g. Blood CBC, X-Ray"
//                                 className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
//                             />
//                             <button type="button" onClick={addTest} className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm transition">
//                                 Add
//                             </button>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                             {form.tests.map((test, i) => (
//                                 <span key={i} className="flex items-center gap-1.5 bg-orange-50 text-orange-600 text-sm px-3 py-1 rounded-full">
//                                     {test}
//                                     <button type="button" onClick={() => removeTest(i)} className="hover:text-red-500">
//                                         <FiTrash2 size={12} />
//                                     </button>
//                                 </span>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl border border-gray-100 p-5">
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">Advice</label>
//                         <textarea
//                             value={form.advice}
//                             onChange={(e) => setForm({ ...form, advice: e.target.value })}
//                             placeholder="General advice for the patient..."
//                             rows={3}
//                             className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
//                         />
//                     </div>

//                     <div className="bg-white rounded-xl border border-gray-100 p-5">
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">Follow-up Date</label>
//                         <input
//                             type="date"
//                             value={form.followUpDate}
//                             onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
//                             min={new Date().toISOString().split('T')[0]}
//                             className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
//                     >
//                         {loading ? (
//                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         ) : (
//                             <><FiSend size={16} /> Send Prescription to Patient</>
//                         )}
//                     </button>
//                 </form>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default WritePrescription;





import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { createPrescription } from '../../services/prescriptionService';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiSend } from 'react-icons/fi';
import api from '../../services/api';

const WritePrescription = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        diagnosis: '',
        advice: '',
        followUpDate: '',
        tests: [],
        // ✅ Added patientAge and patientSex
        patientAge: '',
        patientSex: '',
        medicines: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }],
    });

    const [testInput, setTestInput] = useState('');

    useEffect(() => {
        fetchAppointment();
    }, [appointmentId]);

    // ✅ FIX 1: Added error toast + String() comparison for reliable _id matching
    const fetchAppointment = async () => {
        try {
            const { data } = await api.get('/appointments/doctor');
            const apt = data.appointments.find((a) => String(a._id) === String(appointmentId));
            if (!apt) toast.error('Appointment not found');
            setAppointment(apt);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load appointment details');
        }
    };

    const addMedicine = () => {
        setForm({
            ...form,
            medicines: [...form.medicines, { name: '', dosage: '', frequency: '', duration: '', notes: '' }],
        });
    };

    const removeMedicine = (index) => {
        setForm({
            ...form,
            medicines: form.medicines.filter((_, i) => i !== index),
        });
    };

    const updateMedicine = (index, field, value) => {
        const updated = [...form.medicines];
        updated[index][field] = value;
        setForm({ ...form, medicines: updated });
    };

    const addTest = () => {
        if (!testInput.trim()) return;
        setForm({ ...form, tests: [...form.tests, testInput.trim()] });
        setTestInput('');
    };

    const removeTest = (index) => {
        setForm({ ...form, tests: form.tests.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ FIX 2: Guard against null appointment / missing patientId
        if (!appointment) return toast.error('Appointment data not loaded');
        if (!appointment?.patient?._id) return toast.error('Patient info is missing');
        if (!form.diagnosis) return toast.error('Diagnosis is required');

        // ✅ Validate age and sex
        if (!form.patientAge) return toast.error('Patient age is required');
        if (!form.patientSex) return toast.error('Patient sex is required');

        // ✅ FIX 3: Validate all schema-required medicine fields
        for (const m of form.medicines) {
            if (!m.name) return toast.error('Fill in the name for all medicines');
            if (!m.dosage) return toast.error('Fill in the dosage for all medicines');
            if (!m.frequency) return toast.error('Fill in the frequency for all medicines');
            if (!m.duration) return toast.error('Fill in the duration for all medicines');
        }

        setLoading(true);
        try {
            await createPrescription({
                appointmentId,
                patientId: appointment.patient._id,
                ...form,
            });
            toast.success('Prescription sent to patient!');
            navigate('/doctor/appointments');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Write Prescription</h1>
                {appointment && (
                    <p className="text-gray-500 text-sm mb-6">Patient: {appointment.patient?.name}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ✅ Patient Age & Sex */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Patient Info *</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Age</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 35"
                                    value={form.patientAge}
                                    onChange={(e) => setForm({ ...form, patientAge: e.target.value })}
                                    min={0}
                                    max={150}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Sex</label>
                                <select
                                    value={form.patientSex}
                                    onChange={(e) => setForm({ ...form, patientSex: e.target.value })}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnosis *</label>
                        <textarea
                            value={form.diagnosis}
                            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                            placeholder="Enter diagnosis..."
                            rows={3}
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-semibold text-gray-700">Medicines *</label>
                            <button type="button" onClick={addMedicine} className="flex items-center gap-1 text-primary-500 hover:text-primary-600 text-sm font-medium">
                                <FiPlus size={16} /> Add Medicine
                            </button>
                        </div>
                        <div className="space-y-4">
                            {form.medicines.map((med, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-medium text-gray-600">Medicine {i + 1}</p>
                                        {form.medicines.length > 1 && (
                                            <button type="button" onClick={() => removeMedicine(i)} className="text-red-400 hover:text-red-500">
                                                <FiTrash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2">
                                            <input
                                                type="text"
                                                placeholder="Medicine name *"
                                                value={med.name}
                                                onChange={(e) => updateMedicine(i, 'name', e.target.value)}
                                                required
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                        {/* ✅ FIX 4: Added required to dosage, frequency, duration inputs */}
                                        <input
                                            type="text"
                                            placeholder="Dosage (e.g. 500mg) *"
                                            value={med.dosage}
                                            onChange={(e) => updateMedicine(i, 'dosage', e.target.value)}
                                            required
                                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Frequency (e.g. twice daily) *"
                                            value={med.frequency}
                                            onChange={(e) => updateMedicine(i, 'frequency', e.target.value)}
                                            required
                                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Duration (e.g. 7 days) *"
                                            value={med.duration}
                                            onChange={(e) => updateMedicine(i, 'duration', e.target.value)}
                                            required
                                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Notes (optional)"
                                            value={med.notes}
                                            onChange={(e) => updateMedicine(i, 'notes', e.target.value)}
                                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Tests / Investigations</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={testInput}
                                onChange={(e) => setTestInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTest())}
                                placeholder="e.g. Blood CBC, X-Ray"
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button type="button" onClick={addTest} className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm transition">
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.tests.map((test, i) => (
                                <span key={i} className="flex items-center gap-1.5 bg-orange-50 text-orange-600 text-sm px-3 py-1 rounded-full">
                                    {test}
                                    <button type="button" onClick={() => removeTest(i)} className="hover:text-red-500">
                                        <FiTrash2 size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Advice</label>
                        <textarea
                            value={form.advice}
                            onChange={(e) => setForm({ ...form, advice: e.target.value })}
                            placeholder="General advice for the patient..."
                            rows={3}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Follow-up Date</label>
                        <input
                            type="date"
                            value={form.followUpDate}
                            onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <><FiSend size={16} /> Send Prescription to Patient</>
                        )}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default WritePrescription;