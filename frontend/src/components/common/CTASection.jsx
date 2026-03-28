import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const CTASection = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-blue-600 py-15">

            {/* ── Animated medical background VFX ── */}
            <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

                {/* Heartbeat ECG line */}
                <svg className="absolute bottom-8 left-0 w-full opacity-10" viewBox="0 0 1200 80" preserveAspectRatio="none">
                    <polyline
                        points="0,40 100,40 130,40 140,10 150,70 160,40 170,40 270,40 300,40 310,15 320,65 330,40 340,40 440,40 470,40 480,5 490,75 500,40 510,40 610,40 640,40 650,20 660,60 670,40 680,40 780,40 810,40 820,10 830,70 840,40 850,40 950,40 980,40 990,15 1000,65 1010,40 1020,40 1120,40 1200,40"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <animate attributeName="stroke-dasharray" from="0,2000" to="2000,0" dur="4s" repeatCount="indefinite" />
                    </polyline>
                </svg>

                {/* Floating medical cross icons */}
                {[
                    { x: '8%', y: '20%', size: 28, delay: '0s', dur: '6s' },
                    { x: '85%', y: '15%', size: 20, delay: '1s', dur: '7s' },
                    { x: '15%', y: '70%', size: 16, delay: '2s', dur: '5s' },
                    { x: '90%', y: '65%', size: 24, delay: '0.5s', dur: '8s' },
                    { x: '50%', y: '10%', size: 14, delay: '3s', dur: '6s' },
                    { x: '75%', y: '80%', size: 18, delay: '1.5s', dur: '7s' },
                ].map((c, i) => (
                    <svg
                        key={i}
                        className="absolute opacity-20"
                        style={{ left: c.x, top: c.y, width: c.size, height: c.size }}
                        viewBox="0 0 24 24"
                    >
                        <rect x="9" y="2" width="6" height="20" rx="2" fill="white">
                            <animateTransform attributeName="transform" type="rotate" from={`0 12 12`} to={`360 12 12`} dur={c.dur} begin={c.delay} repeatCount="indefinite" />
                        </rect>
                        <rect x="2" y="9" width="20" height="6" rx="2" fill="white">
                            <animateTransform attributeName="transform" type="rotate" from={`0 12 12`} to={`360 12 12`} dur={c.dur} begin={c.delay} repeatCount="indefinite" />
                        </rect>
                        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-8; 0,0" dur={c.dur} begin={c.delay} repeatCount="indefinite" />
                    </svg>
                ))}

                {/* Pulsing circles (sonar effect) */}
                {[
                    { cx: '5%', cy: '50%', delay: '0s' },
                    { cx: '95%', cy: '50%', delay: '1.5s' },
                ].map((p, i) => (
                    <span key={i} className="absolute rounded-full border border-white opacity-20"
                        style={{
                            left: p.cx, top: p.cy,
                            width: 120, height: 120,
                            transform: 'translate(-50%, -50%)',
                            animation: `ctaPulse 3s ease-out ${p.delay} infinite`,
                        }}
                    />
                ))}

                {/* DNA helix dots */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="absolute rounded-full bg-white opacity-10"
                        style={{
                            width: 6, height: 6,
                            left: `${20 + i * 5.5}%`,
                            top: `${50 + Math.sin(i * 0.8) * 30}%`,
                            animation: `ctaFloat 3s ease-in-out ${i * 0.2}s infinite alternate`,
                        }}
                    />
                ))}
                {Array.from({ length: 12 }).map((_, i) => (
                    <span key={'b' + i} className="absolute rounded-full bg-white opacity-10"
                        style={{
                            width: 6, height: 6,
                            left: `${20 + i * 5.5}%`,
                            top: `${50 - Math.sin(i * 0.8) * 30}%`,
                            animation: `ctaFloat 3s ease-in-out ${i * 0.2 + 1.5}s infinite alternate`,
                        }}
                    />
                ))}
            </div>

            {/* ── Keyframes ── */}
            <style>{`
                @keyframes ctaPulse {
                    0%   { transform: translate(-50%, -50%) scale(0.5); opacity: 0.3; }
                    100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
                }
                @keyframes ctaFloat {
                    from { transform: translateY(0px); }
                    to   { transform: translateY(-10px); }
                }
            `}</style>

            {/* ── Content ── */}
            <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Doctors available now
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    Ready to Get Started?
                </h2>
                <p className="text-blue-100 mb-10 text-lg max-w-xl mx-auto">
                    Join thousands of patients who trust Telemedicine for their healthcare needs.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        to="/register"
                        className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
                    >
                        Create Free Account
                    </Link>
                    <Link
                        to="/doctors"
                        className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition flex items-center gap-2 hover:-translate-y-0.5 transform duration-200"
                    >
                        Browse Doctors <FiArrowRight />
                    </Link>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap justify-center gap-6 mt-10 text-blue-100 text-sm">
                    {['100% Secure', 'Free Chat', 'Licensed Doctors'].map((badge) => (
                        <span key={badge} className="flex items-center gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeOpacity="0.5" />
                                <path d="M4 7l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CTASection;