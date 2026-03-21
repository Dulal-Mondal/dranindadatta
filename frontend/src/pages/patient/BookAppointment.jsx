import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { getDoctorById } from '../../services/doctorService';
import { bookAppointment } from '../../services/appointmentService';
import { formatBDT } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiVideo, FiFileText, FiArrowRight } from 'react-icons/fi';

const timeSlots = [
    '09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00',
    '11:00 - 11:30', '11:30 - 12:00', '14:00 - 14:30', '14:30 - 15:00',
    '15:00 - 15:30', '15:30 - 16:00', '16:00 - 16:30', '16:30 - 17:00',
];

const BookAppointment = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        appointmentDate: '',
        timeSlot: '',
        symptoms: '',
        type: 'video',
    });

    useEffect(() => {
        fetchDoctor();
    }, [doctorId]);

    const fetchDoctor = async () => {
        try {
            const { data } = await getDoctorById(doctorId);
            setDoctor(data.doctor);
        } catch (err) {
            toast.error('Doctor not found');
            navigate('/doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.timeSlot) return toast.error('Please select a time slot');

        setSubmitting(true);
        try {
            const { data } = await bookAppointment({
                doctorId,
                ...form,
            });

            if (data.paymentUrl) {
                toast.success('Redirecting to payment...');
                window.location.href = data.paymentUrl;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        } finally {
            setSubmitting(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    if (loading) return <><Navbar /><Loader fullScreen /></>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Book Appointment</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="md:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="bg-white rounded-xl border border-gray-100 p-5">
                                <h3 className="font-semibold text-gray-800 mb-4">Consultation Type</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'video', label: 'Video Call', icon: <FiVideo size={20} />, desc: 'Face-to-face consultation' },
                                        { value: 'chat', label: 'Chat Only', icon: <FiFileText size={20} />, desc: 'Text based consultation' },
                                    ].map((t) => (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => setForm({ ...form, type: t.value })}
                                            className={'p-4 rounded-xl border-2 text-left transition ' + (form.type === t.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200')}
                                        >
                                            <div className={'w-10 h-10 rounded-lg flex items-center justify-center mb-2 ' + (form.type === t.value ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500')}>
                                                {t.icon}
                                            </div>
                                            <p className="font-medium text-sm text-gray-800">{t.label}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-5">
                                <h3 className="font-semibold text-gray-800 mb-4">Select Date</h3>
                                <input
                                    type="date"
                                    min={today}
                                    value={form.appointmentDate}
                                    onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-5">
                                <h3 className="font-semibold text-gray-800 mb-4">Select Time Slot</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => setForm({ ...form, timeSlot: slot })}
                                            className={'py-2 px-3 rounded-lg text-sm font-medium transition border ' + (form.timeSlot === slot ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300')}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-5">
                                <h3 className="font-semibold text-gray-800 mb-4">Describe Your Symptoms</h3>
                                <textarea
                                    value={form.symptoms}
                                    onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                                    placeholder="Describe your symptoms or reason for visit..."
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>Proceed to Payment <FiArrowRight /></>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <h3 className="font-semibold text-gray-800 mb-4">Doctor Info</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={doctor?.user?.avatar || 'https://ui-avatars.com/api/?name=' + doctor?.user?.name + '&background=0ea5e9&color=fff&size=80'}
                                    alt={doctor?.user?.name}
                                    className="w-14 h-14 rounded-xl object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">Dr. {doctor?.user?.name}</p>
                                    <p className="text-sm text-primary-500">{doctor?.specialization}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FiClock size={14} className="text-gray-400" />
                                    {doctor?.experience} years experience
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <h3 className="font-semibold text-gray-800 mb-3">Payment Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Consultation Fee</span>
                                    <span>{formatBDT(doctor?.consultationFee)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Platform Fee</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold text-gray-800">
                                    <span>Total</span>
                                    <span className="text-primary-500">{formatBDT(doctor?.consultationFee)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                            <p className="font-medium mb-1">Payment via SSLCommerz</p>
                            <p className="text-xs text-blue-600">Secure payment with bKash, Nagad, Card and more.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BookAppointment;