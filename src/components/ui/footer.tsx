import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
    InstagramLogoIcon,
    TwitterLogoIcon,
    FacebookLogoIcon,
    YoutubeLogoIcon,
    HeartIcon,
} from "@phosphor-icons/react";
import { Link } from "wouter";

export default function Footer() {
    const links = [
        { name: "About", href: "#" },
        { name: "Contact", href: "#" },
        { name: "FAQs", href: "#" },
        { name: "Terms", href: "#" },
    ];

    const socials = [
        { icon: InstagramLogoIcon, href: "#", label: "Instagram" },
        { icon: TwitterLogoIcon, href: "#", label: "Twitter" },
        { icon: FacebookLogoIcon, href: "#", label: "Facebook" },
        { icon: YoutubeLogoIcon, href: "#", label: "YouTube" },
    ];

    return (
        <footer className="bg-background border-t border-border/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-32 py-8 sm:py-12">
                <div className="flex flex-col items-center justify-between gap-6 sm:gap-8">
                    {/* Logo and Copyright */}
                    <motion.div
                        className="flex flex-col items-center gap-4 sm:gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}>
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm sm:text-lg">
                                    F
                                </span>
                            </div>
                            <span className="text-xl sm:text-2xl font-bold text-foreground">
                                FluxOasis
                            </span>
                        </div>

                        {/* Copyright */}
                        <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                            <span>© 2025 FluxOasis™</span>
                        </div>
                    </motion.div>

                    {/* Navigation Links */}
                    <motion.nav
                        className="flex items-center gap-6 sm:gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}>
                        {links.map((link, index) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2 + index * 0.1,
                                }}
                                viewport={{ once: true }}>
                                <Button
                                    variant="ghost"
                                    className="text-sm sm:text-base text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all duration-200 px-3 sm:px-4 py-2 rounded-lg"
                                    asChild>
                                    <a href={link.href}>{link.name}</a>
                                </Button>
                            </motion.div>
                        ))}
                    </motion.nav>

                    {/* Social Icons */}
                    <motion.div
                        className="flex items-center gap-3 sm:gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}>
                        {socials.map((social, index) => (
                            <motion.div
                                key={social.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.4 + index * 0.1,
                                }}
                                viewport={{ once: true }}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all duration-200 rounded-full"
                                    asChild>
                                    <Link
                                        to={social.href}
                                        aria-label={social.label}>
                                        <social.icon
                                            className="w-8 h-8 sm:w-6 sm:h-6"
                                            weight="fill"
                                        />
                                    </Link>
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Mobile Copyright (shown only on mobile) */}
            </div>
        </footer>
    );
}
