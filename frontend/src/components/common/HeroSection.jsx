import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter } from "react-icons/fi";

const HeroSection = ({ search, setSearch, specialization, setSpecialization, setPage, SPECIALIZATIONS }) => {

    // ✨ Typing Effect
    const texts = ["Search doctor...", "Cardiologist...", "Dermatologist...", "Neurologist..."];
    const [placeholder, setPlaceholder] = useState("");
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);

    useEffect(() => {
        if (subIndex === texts[index].length) {
            setTimeout(() => {
                setSubIndex(0);
                setIndex((prev) => (prev + 1) % texts.length);
            }, 1000);
            return;
        }

        const timeout = setTimeout(() => {
            setPlaceholder((prev) => prev + texts[index][subIndex]);
            setSubIndex((prev) => prev + 1);
        }, 80);

        return () => clearTimeout(timeout);
    }, [subIndex, index]);

    useEffect(() => {
        if (subIndex === 0) setPlaceholder("");
    }, [index]);

    return (
        <div className="relative bg-gradient-to-r from-primary-500 via-blue-500 to-blue-700 py-24 px-4 overflow-hidden">

            {/* 🔥 Animated Gradient Overlay */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* 🌌 Floating Blobs */}
            <motion.div
                animate={{ x: [0, 120, 0], y: [0, -80, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-80 h-80 bg-white/20 rounded-full blur-3xl top-10 left-10"
            />

            <motion.div
                animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl bottom-0 right-0"
            />

            {/* ✨ Fake Particles */}
            <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:30px_30px] animate-pulse"></div>
            </div>

            {/* ✨ Content */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="max-w-7xl mx-auto text-center text-white relative z-10"
            >

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-bold mb-4"
                >
                    Find Your Doctor
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-blue-100 mb-10 text-lg"
                >
                    Choose from experienced specialists
                </motion.p>

                {/* 🔍 Search */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4"
                >
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-11 pr-4 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white text-sm shadow-2xl"
                        />
                    </div>

                    <div className="relative">
                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={specialization}
                            onChange={(e) => { setSpecialization(e.target.value); setPage(1); }}
                            className="pl-10 pr-6 py-4 rounded-xl text-gray-800 focus:outline-none bg-white text-sm min-w-[200px] shadow-2xl"
                        >
                            <option value="">All Specializations</option>
                            {SPECIALIZATIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HeroSection;