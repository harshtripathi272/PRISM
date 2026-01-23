"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/UI/Navbar";
import Footer from "@/components/UI/Footer";

const features = [
    {
        category: "Noise Cancellation",
        title: "Industry-Leading ANC",
        description: "Dual Noise Sensor technology with 8 microphones captures ambient noise and adapts in real-time.",
        specs: ["HD Noise Cancelling Processor QN1", "20Hz-20kHz frequency range", "Automatic wind noise reduction"]
    },
    {
        category: "Audio Quality",
        title: "40mm Dynamic Drivers",
        description: "Precision-engineered drivers deliver powerful bass, clear mids, and crystalline highs.",
        specs: ["Hi-Res Audio certified", "DSEE Extreme™ upscaling", "360 Reality Audio compatible"]
    },
    {
        category: "Smart Features",
        title: "Adaptive Sound Control",
        description: "AI learns your behavior and automatically adjusts ambient sound settings based on your activity.",
        specs: ["Speak-to-Chat", "Quick Attention mode", "Multipoint connection"]
    },
    {
        category: "Battery & Charging",
        title: "All-Day Power",
        description: "Up to 30 hours of playback with noise cancelling. Quick charging gives 5 hours in 10 minutes.",
        specs: ["30hr battery (ANC on)", "40hr battery (ANC off)", "USB-C fast charging"]
    },
    {
        category: "Comfort",
        title: "Premium Build",
        description: "Soft pressure-relieving ear pads and lightweight design for all-day comfort.",
        specs: ["254g weight", "Memory foam cushions", "Swivel & fold design"]
    },
    {
        category: "Connectivity",
        title: "Bluetooth 5.2",
        description: "Stable wireless connection with support for high-quality codecs including LDAC.",
        specs: ["Bluetooth 5.2", "LDAC / AAC / SBC", "NFC pairing"]
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
};

export default function TechnologyPage() {
    return (
        <div className="bg-primary min-h-screen">
            <Navbar />

            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="text-xs uppercase tracking-[0.25em] text-accent-cyan mb-6 block">
                            Technology
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight">
                            Engineered for{" "}
                            <span className="text-white/40">excellence.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/60 max-w-3xl leading-relaxed">
                            Every feature, every component—designed with obsessive attention to detail.
                            Discover the technology that makes Prism the ultimate listening experience.
                        </p>
                    </motion.div>
                </section>

                {/* Features Grid */}
                <section className="max-w-7xl mx-auto px-6 md:px-12">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group p-8 border border-white/5 rounded-2xl bg-secondary/30 hover:bg-secondary/50 hover:border-white/10 transition-all duration-300"
                            >
                                <span className="text-xs uppercase tracking-wider text-accent-blue mb-4 block">
                                    {feature.category}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-white/60 leading-relaxed mb-6">
                                    {feature.description}
                                </p>
                                <ul className="space-y-2">
                                    {feature.specs.map((spec, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-white/40">
                                            <span className="w-1 h-1 rounded-full bg-accent-cyan" />
                                            {spec}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* CTA Section */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 mt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center py-16 border-t border-white/5"
                    >
                        <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6">
                            Experience it yourself.
                        </h2>
                        <button className="px-10 py-4 rounded-full bg-white text-black font-semibold text-base transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]">
                            Buy Prism
                        </button>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
