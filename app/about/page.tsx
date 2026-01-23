"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/UI/Navbar";
import Footer from "@/components/UI/Footer";

export default function AboutPage() {
    return (
        <div className="bg-primary min-h-screen">
            <Navbar />

            <main className="pt-24 pb-16">

                {/* Hero */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl"
                    >
                        <span className="text-xs uppercase tracking-[0.25em] text-accent-cyan mb-6 block">
                            About Prism
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold text-white mb-12 tracking-tight leading-[0.95]">
                            Sound is personal.
                            <br />
                            <span className="text-white/40">So is silence.</span>
                        </h1>
                        <p className="text-2xl text-white/70 leading-relaxed">
                            We believe that great audio isn't just about what you hear—it's about what you don't.
                            Prism was born from a singular obsession: to create the perfect sanctuary of sound.
                        </p>
                    </motion.div>
                </section>

                {/* Mission */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-16 items-center"
                    >
                        <div>
                            <h2 className="text-xs uppercase tracking-[0.25em] text-accent-blue mb-6">
                                Our Mission
                            </h2>
                            <h3 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
                                Redefining the listening experience.
                            </h3>
                            <p className="text-lg text-white/60 leading-relaxed mb-4">
                                In a world that never stops, we recognize the need for moments of pure focus.
                                Prism earbuds are designed not just to deliver exceptional sound, but to create
                                a personal oasis—where distractions fade and only what matters remains.
                            </p>
                            <p className="text-lg text-white/60 leading-relaxed">
                                From the precision-tuned drivers to the AI-powered noise cancellation, every element
                                is engineered to elevate your audio experience to new heights.
                            </p>
                        </div>
                        <div className="aspect-square bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 rounded-2xl flex items-center justify-center border border-white/10">
                            <div className="text-center">
                                <div className="text-8xl font-bold text-white/10 mb-4">PRISM</div>
                                <p className="text-white/40 text-sm">Visual placeholder</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Design Philosophy */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40 mb-6">
                            Design Philosophy
                        </h2>
                        <h3 className="text-5xl md:text-6xl font-semibold text-white mb-12 leading-tight max-w-3xl">
                            Form follows function.
                            <br />
                            <span className="text-white/40">Beauty follows both.</span>
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 border border-white/5 rounded-xl bg-secondary/20">
                                <h4 className="text-xl font-semibold text-white mb-4">Minimalism</h4>
                                <p className="text-white/60 leading-relaxed">
                                    Every curve, every surface is intentional. We remove everything that doesn't serve the listening experience.
                                </p>
                            </div>
                            <div className="p-8 border border-white/5 rounded-xl bg-secondary/20">
                                <h4 className="text-xl font-semibold text-white mb-4">Precision</h4>
                                <p className="text-white/60 leading-relaxed">
                                    Engineering excellence isn't optional. We obsess over every millimeter, every material, every connection.
                                </p>
                            </div>
                            <div className="p-8 border border-white/5 rounded-xl bg-secondary/20">
                                <h4 className="text-xl font-semibold text-white mb-4">Timelessness</h4>
                                <p className="text-white/60 leading-relaxed">
                                    Trends fade. Great design endures. Prism is built to feel as fresh in a decade as it does today.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Values */}
                <section className="max-w-7xl mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center py-20 border-t border-white/5"
                    >
                        <h2 className="text-4xl md:text-6xl font-semibold text-white mb-12">
                            Built for those who care.
                        </h2>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12">
                            Whether you're a creator, a commuter, or simply someone who values quality—Prism is for you.
                        </p>
                        <button className="px-10 py-4 rounded-full bg-white text-black font-semibold text-base transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]">
                            Experience Prism
                        </button>
                    </motion.div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
