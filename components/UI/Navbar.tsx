"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const shouldShow = latest > 100;
        if (shouldShow !== isVisible) {
            setIsVisible(shouldShow);
        }
    });

    const navLinks = [
        { href: "/", label: "Overview" },
        { href: "/technology", label: "Technology" },
        { href: "/specs", label: "Specs" },
        { href: "/about", label: "About" },
    ];

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={clsx(
                "fixed top-0 left-0 right-0 z-50",
                "h-14 flex items-center justify-between px-6 md:px-12",
                "bg-primary/75 backdrop-blur-md border-b border-white/5",
                "pointer-events-none data-[visible=true]:pointer-events-auto"
            )}
            data-visible={isVisible}
        >
            {/* Left: Logo */}
            <Link href="/" className="text-white font-medium tracking-tight text-sm md:text-base hover:text-white/80 transition-colors">
                PRISM
            </Link>

            {/* Center: Links (Desktop) */}
            <div className="hidden md:flex items-center gap-8 text-xs font-medium">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={clsx(
                            "transition-colors",
                            pathname === link.href
                                ? "text-white"
                                : "text-white/70 hover:text-white"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Right: CTA */}
            <div className="flex items-center gap-4">
                <Link href="/buy" className={clsx(
                    "px-4 py-1.5 rounded-full text-xs font-semibold text-white",
                    "bg-gradient-to-r from-accent-blue via-accent-blue to-accent-cyan",
                    "hover:shadow-[0_0_15px_rgba(0,80,255,0.5)] transition-shadow duration-300"
                )}>
                    Buy
                </Link>
            </div>
        </motion.nav>
    );
}
