import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter } from "react-icons/fi";

const HeroSection = ({
    search,
    setSearch,
    specialization,
    setSpecialization,
    setPage,
    SPECIALIZATIONS,
}) => {
    const texts = [
        "Search doctor...",
        "Cardiologist...",
        "Dermatologist...",
        "Neurologist...",
    ];

    const [placeholder, setPlaceholder] = useState("");
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);

    useEffect(() => {
        if (subIndex === texts[index].length) {
            setTimeout(() => {
                setSubIndex(0);
                setIndex((prev) => (prev + 1) % texts.length);
            }, 1200);
            return;
        }

        const timeout = setTimeout(() => {
            setPlaceholder((prev) => prev + texts[index][subIndex]);
            setSubIndex((prev) => prev + 1);
        }, 70);

        return () => clearTimeout(timeout);
    }, [subIndex, index]);

    useEffect(() => {
        if (subIndex === 0) setPlaceholder("");
    }, [index]);

    return (
        <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 py-16 px-4 overflow-hidden">

            {/* 🏥 Background Medical Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118"
                    className="w-full h-full object-cover opacity-10 blur-sm"
                    alt="medical"
                />
            </div>

            {/* 🧰 Doctor Tools Background */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1580281657527-47f249e8f8c2"
                    className="w-full h-full object-cover opacity-10 mix-blend-overlay"
                    alt="tools"
                />
            </div>

            {/* 🔵 Soft Glow Shapes */}
            <motion.div
                animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
                transition={{ duration: 12, repeat: Infinity }}
                className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-10 left-10"
            />

            <motion.div
                animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
                transition={{ duration: 14, repeat: Infinity }}
                className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl bottom-0 right-0"
            />

            {/* 🌟 Content */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto text-center text-white relative z-10"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                    Find Your Doctor
                </h1>

                <p className="text-blue-100 mb-8">
                    Book appointments with trusted specialists
                </p>

                {/* 🔍 Glass Search Box */}
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-2xl"
                >
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200" />
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/90 text-gray-800 focus:outline-none"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <select
                            value={specialization}
                            onChange={(e) => {
                                setSpecialization(e.target.value);
                                setPage(1);
                            }}
                            className="pl-9 pr-4 py-3 rounded-xl bg-white/90 text-gray-800 focus:outline-none min-w-[180px]"
                        >
                            <option value="">All Specializations</option>
                            {SPECIALIZATIONS.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HeroSection;