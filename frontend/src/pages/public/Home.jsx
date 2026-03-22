import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import DoctorCard from '../../components/doctor/DoctorCard';
import Loader from '../../components/common/Loader';
import { getAllDoctors } from '../../services/doctorService';
import { getSliders } from '../../services/adminService';
import { getBlogs } from '../../services/blogService';
import { getVideos } from '../../services/videoService';
import { formatDate } from '../../utils/formatDate';
import {
    FiArrowRight, FiCheckCircle,
    FiVideo, FiMessageSquare, FiFileText, FiShield,
} from 'react-icons/fi';
import usePageTitle from '../../hooks/usePageTitle';
// ── Hero Slider ──────────────────────────────────────────
const HeroSlider = ({ sliders }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (sliders.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % sliders.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [sliders]);

    if (sliders.length === 0) {
        return (
            <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-blue-700 text-white py-24 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Quality Healthcare <br />
                        <span className="text-yellow-300">At Your Fingertips</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Connect with experienced doctors online. Book appointments, get prescriptions, and consult via video call.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/doctors" className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition">
                            Find a Doctor
                        </Link>
                        <Link to="/register" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition">
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden h-[480px] md:h-[560px]">
            {sliders.map((slide, i) => (
                <div
                    key={slide._id}
                    className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center px-8 md:px-20">
                        <div className="max-w-lg text-white">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{slide.title}</h2>
                            {slide.subtitle && (
                                <p className="text-lg text-white/80 mb-8">{slide.subtitle}</p>
                            )}
                            <Link
                                to={slide.buttonLink || '/doctors'}
                                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3 rounded-xl transition"
                            >
                                {slide.buttonText || 'Learn More'} <FiArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {sliders.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-2.5 h-2.5 rounded-full transition ${i === current ? 'bg-white w-6' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

// ── YouTube Embed ────────────────────────────────────────
const VideoCard = ({ video }) => (
    <div className="card overflow-hidden p-0">
        <div className="aspect-video">
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
            />
        </div>
        <div className="p-4">
            <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-md capitalize">
                {video.category}
            </span>
            <h4 className="font-semibold text-gray-800 mt-2 line-clamp-2">{video.title}</h4>
        </div>
    </div>
);

// ── Blog Card ────────────────────────────────────────────
const BlogCard = ({ blog }) => (
    <Link to={`/blogs/${blog.slug}`} className="card hover:shadow-md transition group p-0 overflow-hidden block">
        {blog.thumbnail && (
            <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
            />
        )}
        <div className="p-5">
            <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-md capitalize">
                {blog.category}
            </span>
            <h4 className="font-semibold text-gray-800 mt-2 mb-2 line-clamp-2 group-hover:text-primary-500 transition">
                {blog.title}
            </h4>
            <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
            <div className="flex items-center gap-2 mt-3">
                <img
                    src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.name}&background=0ea5e9&color=fff&size=32`}
                    alt={blog.author?.name}
                    className="w-6 h-6 rounded-full"
                />
                <span className="text-xs text-gray-500">{blog.author?.name} · {formatDate(blog.createdAt)}</span>
            </div>
        </div>
    </Link>
);

// ── Main Home Page ───────────────────────────────────────
const Home = () => {
    const [sliders, setSliders] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    usePageTitle('Home');
    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [slidersRes, doctorsRes, blogsRes, videosRes] = await Promise.all([
                getSliders().catch(() => ({ data: { sliders: [] } })),
                getAllDoctors({ limit: 6 }).catch(() => ({ data: { doctors: [] } })),
                getBlogs({ limit: 3 }).catch(() => ({ data: { blogs: [] } })),
                getVideos({ limit: 3 }).catch(() => ({ data: { videos: [] } })),
            ]);
            setSliders(slidersRes.data.sliders || []);
            setDoctors(doctorsRes.data.doctors || []);
            setBlogs(blogsRes.data.blogs || []);
            setVideos(videosRes.data.videos || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: <FiVideo size={24} />, title: 'Video Consultation', desc: 'Face-to-face consultation with doctors via HD video call.', color: 'blue' },
        { icon: <FiMessageSquare size={24} />, title: 'Live Chat', desc: 'Message your doctor anytime for free. Quick responses.', color: 'green' },
        { icon: <FiFileText size={24} />, title: 'Digital Prescription', desc: 'Receive and download your prescription as PDF anytime.', color: 'purple' },
        { icon: <FiShield size={24} />, title: 'Secure & Private', desc: 'Your health data is safe and completely confidential.', color: 'orange' },
    ];

    const colorMap = {
        blue: 'bg-blue-50 text-blue-500',
        green: 'bg-green-50 text-green-500',
        purple: 'bg-purple-50 text-purple-500',
        orange: 'bg-orange-50 text-orange-500',
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Slider */}
            <HeroSlider sliders={sliders} />

            {/* Stats */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { value: '500+', label: 'Doctors' },
                        { value: '10k+', label: 'Patients' },
                        { value: '50k+', label: 'Consultations' },
                        { value: '4.9★', label: 'Rating' },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p className="text-3xl font-bold text-primary-500">{stat.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">Why Choose Us?</h2>
                    <p className="text-gray-500 mt-2">Everything you need for quality healthcare online</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f) => (
                        <div key={f.title} className="card text-center hover:shadow-md transition">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${colorMap[f.color]}`}>
                                {f.icon}
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                            <p className="text-sm text-gray-500">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Doctors */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Top Doctors</h2>
                            <p className="text-gray-500 mt-1">Experienced specialists ready to help</p>
                        </div>
                        <Link to="/doctors" className="btn-outline text-sm flex items-center gap-2">
                            View All <FiArrowRight />
                        </Link>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : doctors.length === 0 ? (
                        <p className="text-center text-gray-400 py-10">No doctors available yet</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctors.map((doctor) => (
                                <DoctorCard key={doctor._id} doctor={doctor} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* How it works */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
                    <p className="text-gray-500 mt-2">Get started in 3 simple steps</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { step: '01', title: 'Create Account', desc: 'Sign up as a patient and complete your profile in minutes.' },
                        { step: '02', title: 'Book Appointment', desc: 'Find your doctor, choose a time slot and pay securely online.' },
                        { step: '03', title: 'Start Consultation', desc: 'Connect via video call or chat and get your prescription.' },
                    ].map((item) => (
                        <div key={item.step} className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary-500 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                                {item.step}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Blogs */}
            {blogs.length > 0 && (
                <section className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Health Blogs</h2>
                                <p className="text-gray-500 mt-1">Tips and guides from our doctors</p>
                            </div>
                            <Link to="/blogs" className="btn-outline text-sm flex items-center gap-2">
                                View All <FiArrowRight />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {blogs.map((blog) => (
                                <BlogCard key={blog._id} blog={blog} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Videos */}
            {videos.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Health Videos</h2>
                            <p className="text-gray-500 mt-1">Watch and learn from our experts</p>
                        </div>
                        <Link to="/videos" className="btn-outline text-sm flex items-center gap-2">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-gradient-to-r from-primary-500 to-blue-600 py-16">
                <div className="max-w-3xl mx-auto px-4 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-blue-100 mb-8">
                        Join thousands of patients who trust Telemedicine for their healthcare needs.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition"
                        >
                            Create Free Account
                        </Link>
                        <Link
                            to="/doctors"
                            className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition flex items-center gap-2"
                        >
                            Browse Doctors <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;