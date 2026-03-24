import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiMapPin, FiShield, FiYoutube, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const TikTokIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
);

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            {/* <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                               
                            </div> */}

                            <img src="/logo1.png" alt="logo" className='w-60 h-40' />

                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            Quality healthcare at your fingertips. Connect with top doctors anytime, anywhere.
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <a href="https://www.facebook.com/profile.php?id=61580455479102#" target="_blank" rel="noreferrer" title="Facebook"
                                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#1877F2] transition">
                                <FiFacebook size={16} />
                            </a>
                            <a href="https://x.com/aninda50359" target="_blank" rel="noreferrer" title="Twitter"
                                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#1DA1F2] transition">
                                <FiTwitter size={16} />
                            </a>
                            <a href="https://www.instagram.com/dr_aninda_datta" target="_blank" rel="noreferrer" title="Instagram"
                                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#E1306C] transition">
                                <FiInstagram size={16} />
                            </a>
                            <a href="https://www.youtube.com/@dranindadatta" target="_blank" rel="noreferrer" title="YouTube"
                                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#FF0000] transition">
                                <FiYoutube size={16} />
                            </a>
                            <a href="https://www.tiktok.com/@doctoranindadatta?_r=1&_t=ZS-94qu3wmLCKe" target="_blank" rel="noreferrer" title="TikTok"
                                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#010101] hover:border hover:border-gray-600 transition">
                                <TikTokIcon size={16} />
                            </a>
                            <a href="https://wa.me/8801410079099" target="_blank" rel="noreferrer" title="WhatsApp"
                                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#25D366] transition">
                                <FaWhatsapp size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/doctors" className="text-sm text-gray-400 hover:text-primary-400 transition">Find Doctors</Link></li>
                            <li><Link to="/blogs" className="text-sm text-gray-400 hover:text-primary-400 transition">Health Blogs</Link></li>
                            <li><Link to="/videos" className="text-sm text-gray-400 hover:text-primary-400 transition">Video Library</Link></li>
                            <li><Link to="/doctors" className="text-sm text-gray-400 hover:text-primary-400 transition">Book Appointment</Link></li>
                        </ul>
                    </div>

                    {/* For Users */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">For Users</h4>
                        <ul className="space-y-2">
                            <li><Link to="/login" className="text-sm text-gray-400 hover:text-primary-400 transition">Patient Login</Link></li>
                            <li><Link to="/login" className="text-sm text-gray-400 hover:text-primary-400 transition">Doctor Login</Link></li>
                            <li><Link to="/register" className="text-sm text-gray-400 hover:text-primary-400 transition">Register</Link></li>
                            <li><Link to="/admin/dashboard" className="text-sm text-gray-400 hover:text-primary-400 transition">Admin Panel</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm text-gray-400">
                                <FiMapPin size={15} className="text-primary-400 shrink-0" />
                                Dhaka, Bangladesh
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-400">
                                <FiPhone size={15} className="text-primary-400 shrink-0" />
                                +880 1410079099
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/8801630079099"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition"
                                >
                                    <FaWhatsapp size={16} className="text-green-400 shrink-0" />
                                    +880 1630079099
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:support@telemedicine.com"
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition"
                                >
                                    <FiMail size={15} className="text-primary-400 shrink-0" />
                                    dranindadatta@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="border-t border-gray-800 mt-10 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col items-center md:items-start gap-3">
                            <div className="flex items-center gap-2">
                                <FiShield size={14} className="text-green-400" />
                                <p className="text-xs text-gray-400 font-medium">Secured by SSLCommerz — We Accept</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="bg-[#E2136E] rounded-lg px-3 py-1.5 flex items-center gap-1">
                                    <span className="text-white text-xs font-extrabold">b</span>
                                    <span className="text-white text-xs font-semibold">Kash</span>
                                </div>
                                <div className="bg-[#F26522] rounded-lg px-3 py-1.5 flex items-center">
                                    <span className="text-white text-xs font-bold">নগদ</span>
                                </div>
                                <div className="bg-[#8B2FC9] rounded-lg px-3 py-1.5 flex items-center gap-1">
                                    <span className="text-xs">🚀</span>
                                    <span className="text-white text-xs font-semibold">Rocket</span>
                                </div>
                                <div className="bg-[#1A1F71] rounded-lg px-3 py-1.5 flex items-center" style={{ minWidth: '52px' }}>
                                    <span className="text-white text-xs font-black italic tracking-wider">VISA</span>
                                </div>
                                <div className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 flex items-center">
                                    <div className="w-5 h-5 bg-[#EB001B] rounded-full" />
                                    <div className="w-5 h-5 bg-[#F79E1B] rounded-full -ml-2 opacity-90" />
                                </div>
                                <div className="bg-[#006B3F] rounded-lg px-3 py-1.5 flex items-center">
                                    <span className="text-white text-xs font-bold">DBBL</span>
                                </div>
                                <div className="bg-[#016FD0] rounded-lg px-3 py-1.5 flex items-center">
                                    <span className="text-white text-xs font-bold tracking-wide">AMEX</span>
                                </div>
                                <div className="bg-gray-700 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                                    <span className="text-xs">🏦</span>
                                    <span className="text-gray-300 text-xs font-medium">Net Banking</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-1.5">
                            <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-1.5">
                                <span className="text-green-400 text-xs">🔒</span>
                                <span className="text-xs text-gray-400">256-bit SSL Encrypted</span>
                            </div>
                            <p className="text-xs text-gray-600">Powered by SSLCommerz Payment Gateway</p>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} || Dr.AnindaDatta. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-500">Made with ❤️ in SoftbrainAi</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;