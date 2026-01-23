"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/UI/Navbar";
import Footer from "@/components/UI/Footer";

const specs = [
    {
        category: "Audio",
        items: [
            { label: "Driver Unit", value: "40mm dome type (CCAW Voice coil)" },
            { label: "Frequency Response", value: "4Hz-40,000Hz" },
            { label: "Impedance", value: "47Ω (1kHz) (when connecting via headphone cable with the unit turned on)" },
            { label: "Sensitivity", value: "104 dB/mW" },
        ]
    },
    {
        category: "Noise Cancellation",
        items: [
            { label: "Technology", value: "HD Noise Cancelling Processor QN1" },
            { label: "Microphones", value: "8 microphones (Dual Noise Sensor + Precise Voice Pickup)" },
            { label: "Ambient Sound Mode", value: "20 levels + Auto" },
        ]
    },
    {
        category: "Wireless",
        items: [
            { label: "Bluetooth Version", value: "Bluetooth 5.2" },
            { label: "Supported Codecs", value: "LDAC, AAC, SBC" },
            { label: "Range", value: "Up to 10m (30ft)" },
            { label: "Multipoint", value: "Connect to 2 devices simultaneously" },
        ]
    },
    {
        category: "Battery",
        items: [
            { label: "Battery Life (NC On)", value: "Up to 30 hours" },
            { label: "Battery Life (NC Off)", value: "Up to 40 hours" },
            { label: "Quick Charge", value: "10 min charge = 5 hours playback" },
            { label: "Charging Port", value: "USB Type-C" },
            { label: "Charging Time", value: "Approx. 3 hours" },
        ]
    },
    {
        category: "Physical",
        items: [
            { label: "Weight", value: "254g" },
            { label: "Cable Length", value: "1.2m" },
            { label: "Plug", value: "Gold-plated L-shaped stereo mini plug" },
            { label: "Design", value: "Over-ear, closed-back" },
        ]
    },
    {
        category: "Features",
        items: [
            { label: "Voice Assistant", value: "Google Assistant, Alexa, Siri" },
            { label: "Speak-to-Chat", value: "Automatic playback pause" },
            { label: "Quick Attention", value: "Cover right ear cup to hear surroundings" },
            { label: "Wearing Detection", value: "Auto pause/play" },
            { label: "DSEE Extreme", value: "AI-powered upscaling" },
            { label: "360 Reality Audio", value: "Supported" },
        ]
    }
];

export default function SpecsPage() {
    return (
        <div className="bg-primary min-h-screen">
            <Navbar />

            <main className="pt-24 pb-16">
                {/* Hero */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="text-xs uppercase tracking-[0.25em] text-white/40 mb-6 block">
                            Technical Specifications
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight">
                            Specs.
                        </h1>
                        <p className="text-xl text-white/60 max-w-3xl">
                            Complete technical details for the Prism earbuds.
                        </p>
                    </motion.div>
                </section>

                {/* Specs Tables */}
                <section className="max-w-5xl mx-auto px-6 md:px-12 space-y-12">
                    {specs.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="border border-white/10 rounded-xl overflow-hidden bg-secondary/20"
                        >
                            <div className="bg-secondary/40 px-6 py-4 border-b border-white/10">
                                <h2 className="text-lg font-semibold text-white uppercase tracking-wider">
                                    {section.category}
                                </h2>
                            </div>
                            <div className="divide-y divide-white/5">
                                {section.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <div className="text-white/50 text-sm font-medium">
                                            {item.label}
                                        </div>
                                        <div className="text-white text-sm">
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* CTA */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 mt-24">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center py-16 border-t border-white/5"
                    >
                        <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6">
                            Ready to upgrade?
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
