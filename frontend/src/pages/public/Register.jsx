import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import usePageTitle from '../../hooks/usePageTitle';
const specializations = [
    'Cardiology', 'Dermatology', 'Neurology',
    'Orthopedics', 'Pediatrics', 'Psychiatry',
    'General Physician', 'Gynecology', 'Dentistry',
    'Ophthalmology', 'ENT', 'Oncology',
];

const Register = () => {

    usePageTitle('Register');
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'patient',
        specialization: '',
        consultationFee: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        if (formData.password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: formData.role,
            };

            if (formData.role === 'doctor') {
                payload.specialization = formData.specialization;
                payload.consultationFee = formData.consultationFee;
            }

            const user = await register(payload);
            toast.success('Account created successfully!');

            if (user.role === 'doctor') navigate('/doctor/dashboard');
            else navigate('/patient/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4 py-10">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <Link to="/">
                        <div className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl">🏥</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-800">Telemedicine</span>
                        </div>
                    </Link>
                    <p className="text-gray-500 mt-2">Create your account</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">

                    <div className="flex gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'patient' })}
                            className={'flex-1 py-2.5 rounded-lg text-sm font-medium transition ' + (formData.role === 'patient' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
                        >
                            Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'doctor' })}
                            className={'flex-1 py-2.5 rounded-lg text-sm font-medium transition ' + (formData.role === 'doctor' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
                        >
                            Doctor
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                            <div className="relative">
                                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="01XXXXXXXXX"
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        {formData.role === 'doctor' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
                                    <select
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    >
                                        <option value="">Select Specialization</option>
                                        {specializations.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Consultation Fee (BDT)</label>
                                    <input
                                        type="number"
                                        name="consultationFee"
                                        value={formData.consultationFee}
                                        onChange={handleChange}
                                        placeholder="500"
                                        required
                                        min="0"
                                        className="input-field"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
                                    required
                                    className="input-field pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        {formData.role === 'doctor' && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                                Doctor accounts require admin approval before you can start consultations.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-500 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>

                <p className="text-center mt-4 text-sm text-gray-500">
                    <Link to="/" className="hover:text-primary-500 transition">
                        Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;