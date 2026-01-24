"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/UI/Navbar";
import Footer from "@/components/UI/Footer";

const colorVariants = [
    { id: "black", name: "Midnight Black", color: "#0A0A0C", bgGradient: "from-gray-900 via-black to-gray-900" },
    { id: "silver", name: "Arctic Silver", color: "#C0C5CE", bgGradient: "from-gray-600 via-gray-400 to-gray-600" },
    { id: "white", name: "Pearl White", color: "#F5F5F5", bgGradient: "from-gray-200 via-white to-gray-200" },
];

const pricingTiers = [
    {
        id: "standard",
        name: "Standard Edition",
        price: 349,
        features: [
            "30-hour battery life",
            "Industry-leading ANC",
            "40mm dynamic drivers",
            "Bluetooth 5.2",
            "Quick charge (5hrs in 10min)",
            "Premium carrying case"
        ]
    },
    {
        id: "pro",
        name: "Pro Edition",
        price: 449,
        badge: "BEST VALUE",
        features: [
            "All Standard features",
            "40-hour battery life",
            "Spatial audio with head tracking",
            "Premium leather case",
            "2-year extended warranty",
            "Priority customer support"
        ]
    }
];

export default function BuyPage() {
    const [selectedColor, setSelectedColor] = useState(colorVariants[1]);
    const [selectedTier, setSelectedTier] = useState(pricingTiers[1]);
    const [quantity, setQuantity] = useState(1);
    const [showCheckout, setShowCheckout] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    const totalPrice = selectedTier.price * quantity;

    const handlePurchase = () => {
        setPurchaseStatus('processing');
        // Simulate API call
        setTimeout(() => {
            setPurchaseStatus('success');
            // Scroll to top of form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    };

    return (
        <div className="bg-primary min-h-screen">
            <Navbar />

            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center mb-16"
                    >
                        <span className="text-xs uppercase tracking-[0.25em] text-accent-cyan mb-6 block">
                            Available Now
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
                            Prism Earbuds
                        </h1>
                        <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto">
                            Silence, perfected. Choose your color, pick your edition.
                        </p>
                    </motion.div>

                    {/* Product Showcase */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mb-16"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedColor.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className={`relative h-96 rounded-3xl bg-gradient-to-br ${selectedColor.bgGradient} 
                                    border border-white/10 overflow-hidden shadow-2xl`}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className={`w-64 h-64 rounded-full blur-3xl opacity-30 bg-gradient-to-r 
                                        ${selectedColor.id === 'black' ? 'from-accent-blue to-accent-cyan' :
                                            selectedColor.id === 'silver' ? 'from-blue-400 to-cyan-300' :
                                                'from-blue-200 to-cyan-200'}`}
                                    />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-6xl md:text-8xl font-bold"
                                        style={{
                                            color: selectedColor.color,
                                            textShadow: '0 0 40px rgba(0,80,255,0.3)'
                                        }}>
                                        PRISM
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Color Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center mb-20"
                    >
                        <h3 className="text-2xl font-semibold text-white mb-6">Choose Your Color</h3>
                        <div className="flex justify-center gap-6">
                            {colorVariants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedColor(variant)}
                                    className="group relative"
                                >
                                    <div className={`w-16 h-16 rounded-full border-2 transition-all duration-300
                                        ${selectedColor.id === variant.id
                                            ? 'border-accent-cyan scale-110 shadow-[0_0_20px_rgba(0,214,255,0.5)]'
                                            : 'border-white/20 hover:border-white/40 hover:scale-105'}`}
                                        style={{ backgroundColor: variant.color }}
                                    />
                                    <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap
                                        transition-colors ${selectedColor.id === variant.id ? 'text-accent-cyan' : 'text-white/50'}`}>
                                        {variant.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Pricing Section */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Choose Your Edition
                        </h2>
                        <p className="text-white/60">Premium quality at every level</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {pricingTiers.map((tier, index) => (
                            <motion.div
                                key={tier.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => setSelectedTier(tier)}
                                className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300
                                    ${selectedTier.id === tier.id
                                        ? 'border-accent-cyan bg-secondary/50 shadow-[0_0_30px_rgba(0,214,255,0.2)]'
                                        : 'border-white/10 bg-secondary/20 hover:border-white/20 hover:bg-secondary/30'}`}
                            >
                                {tier.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 
                                        bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full text-xs font-bold text-white">
                                        {tier.badge}
                                    </div>
                                )}
                                <h3 className="text-2xl font-semibold text-white mb-2">{tier.name}</h3>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-5xl font-bold text-white">${tier.price}</span>
                                    <span className="text-white/40 ml-2">USD</span>
                                </div>
                                <ul className="space-y-3">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-white/80">
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quantity & Add to Cart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="bg-secondary/30 border border-white/10 rounded-2xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-1">
                                        {selectedTier.name} - {selectedColor.name}
                                    </h4>
                                    <p className="text-white/50 text-sm">Free shipping worldwide</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-white">${totalPrice}</div>
                                    <div className="text-xs text-white/40">Total</div>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-white/70">Quantity:</span>
                                <div className="flex items-center gap-3 bg-primary/50 rounded-lg p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-md bg-white/5 hover:bg-white/10 text-white 
                                            transition-colors flex items-center justify-center font-semibold"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center text-white font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                        className="w-10 h-10 rounded-md bg-white/5 hover:bg-white/10 text-white 
                                            transition-colors flex items-center justify-center font-semibold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowCheckout(!showCheckout)}
                                className="w-full py-4 rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan 
                                    text-white font-semibold text-lg transition-all duration-300 
                                    hover:shadow-[0_0_30px_rgba(0,214,255,0.4)] hover:scale-[1.02]"
                            >
                                {showCheckout ? 'Hide Checkout' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* Checkout Form */}
                <AnimatePresence>
                    {showCheckout && (
                        <motion.section
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-3xl mx-auto px-6 md:px-12 mb-20 overflow-hidden"
                        >
                            <div className="bg-secondary/30 border border-white/10 rounded-2xl p-8">
                                {purchaseStatus === 'success' ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h3>
                                        <p className="text-white/60 mb-8">
                                            Thank you for your purchase. Your order number is <span className="text-accent-cyan font-mono">#PRISM-{Math.floor(Math.random() * 10000)}</span>.
                                        </p>
                                        <p className="text-white/40 text-sm">
                                            A confirmation email has been sent to your provided email address.
                                        </p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="mt-8 px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-2xl font-semibold text-white mb-6">Checkout Details</h3>
                                        <p className="text-white/40 text-sm mb-8">
                                            All transactions are secure and encrypted.
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Contact Information */}
                                            <div className="md:col-span-2">
                                                <h4 className="text-white font-medium mb-4">Contact Information</h4>
                                            </div>
                                            <div>
                                                <label className="block text-white/70 text-sm mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="John"
                                                    className="w-full px-4 py-3 bg-primary/50 border border-white/10 rounded-lg 
                                                        text-white placeholder-white/30 focus:border-accent-cyan focus:outline-none 
                                                        transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/70 text-sm mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Doe"
                                                    className="w-full px-4 py-3 bg-primary/50 border border-white/10 rounded-lg 
                                                        text-white placeholder-white/30 focus:border-accent-cyan focus:outline-none 
                                                        transition-colors"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-white/70 text-sm mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="john.doe@example.com"
                                                    className="w-full px-4 py-3 bg-primary/50 border border-white/10 rounded-lg 
                                                        text-white placeholder-white/30 focus:border-accent-cyan focus:outline-none 
                                                        transition-colors"
                                                />
                                            </div>

                                            {/* Shipping Address */}
                                            <div className="md:col-span-2 mt-6">
                                                <h4 className="text-white font-medium mb-4">Shipping Address</h4>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-white/70 text-sm mb-2">Street Address</label>
                                                <input
                                                    type="text"
                                                    placeholder="123 Main Street"
                                                    className="w-full px-4 py-3 bg-primary/50 border border-white/10 rounded-lg 
                                                        text-white placeholder-white/30 focus:border-accent-cyan focus:outline-none 
                                                        transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/70 text-sm mb-2">City</label>
                                                <input
                                                    type="text"
                                                    placeholder="San Francisco"
                                                    className="w-full px-4 py-3 bg-primary/50 border border-white/10 rounded-lg 
                                                        text-white placeholder-white/30 focus:border-accent-cyan focus:outline-none 
                                                        transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/70 text-sm mb-2">Postal Code</label>
                                                <input
                                                    type="text"
                                                    placeholder="94102"
                                                    className="w-full px-4 py-3 bg-primary/50 border border-white/10 rounded-lg 
                                                        text-white placeholder-white/30 focus:border-accent-cyan focus:outline-none 
                                                        transition-colors"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-white/70 text-sm mb-2">Country</label>
                                                <input
                                                    type="text"
                                                    placeholder="United States"
                                                    className="w-full px-4 py-3 bg-primary/50 border border-white/10 rounded-lg 
                                                        text-white placeholder-white/30 focus:border-accent-cyan focus:outline-none 
                                                        transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePurchase}
                                            disabled={purchaseStatus === 'processing'}
                                            className="w-full mt-8 py-4 rounded-full bg-white text-black font-semibold text-lg 
                                                transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] 
                                                hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {purchaseStatus === 'processing' ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Complete Purchase'
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Trust Indicators */}
                <section className="max-w-7xl mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8 py-16 border-t border-white/5"
                    >
                        <div className="text-center">
                            <div className="text-4xl mb-3"></div>
                            <h2 className="text-white font-semibold mb-2">Free Shipping</h2>
                            <p className="text-white/50 text-sm">Worldwide delivery included</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3"></div>
                            <h2 className="text-white font-semibold mb-2">Secure Payment</h2>
                            <p className="text-white/50 text-sm">SSL encrypted checkout</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3"></div>
                            <h2 className="text-white font-semibold mb-2">30-Day Returns</h2>
                            <p className="text-white/50 text-sm">Risk-free satisfaction guarantee</p>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
