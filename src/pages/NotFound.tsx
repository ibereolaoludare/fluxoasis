import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
    HouseIcon,
    MagnifyingGlassIcon,
    PackageIcon,
} from "@phosphor-icons/react";
import { Link } from "wouter";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function NotFound() {
    return (
        <>
            <Header />
            <main className="py-8 bg-background flex items-center justify-center px-4 sm:px-8 lg:px-16 xl:px-32">
                <div className="max-w-4xl mx-auto text-center">
                    {/* 404 Number */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}>
                        <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-none">
                            404
                        </h1>
                    </motion.div>

                    {/* Error Message */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            The page you're looking for seems to have wandered
                            off. Maybe it's thirsty and went to get a drink? 🥤
                        </p>
                    </motion.div>

                    {/* Floating Drink Icons */}
                    <motion.div
                        className="relative mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}>
                        <div className="flex justify-center items-center gap-8 sm:gap-12">
                            {[
                                { icon: PackageIcon, delay: 0 },
                                { icon: MagnifyingGlassIcon, delay: 0.2 },
                                { icon: HouseIcon, delay: 0.4 },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="w-12 h-12 sm:w-16 sm:h-16 bg-muted/30 rounded-full flex items-center justify-center border border-border/20"
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 5, -5, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: item.delay,
                                        ease: "easeInOut",
                                    }}>
                                    <item.icon
                                        className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground"
                                        weight="regular"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            <Button
                                asChild
                                className="w-full sm:w-auto text-sm sm:text-base !p-4 sm:!p-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full transition-all duration-300 group">
                                <Link to="/home">
                                    <HouseIcon className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
                                    Go Home
                                </Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="outline"
                                asChild
                                className="w-full sm:w-auto text-sm sm:text-base !p-4 sm:!p-6 rounded-full transition-all duration-300 group">
                                <Link to="/shop">
                                    <PackageIcon className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
                                    Browse Drinks
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Helpful Links */}
                    <motion.div
                        className="mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}>
                        <p className="text-sm text-muted-foreground mb-4">
                            Or try these popular pages:
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {[
                                { name: "About", href: "/about" },
                                { name: "Contact", href: "/contact" },
                                { name: "Shop", href: "/shop" },
                            ].map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 1 + index * 0.1,
                                    }}>
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all duration-200 px-3 py-2 rounded-lg">
                                        <Link to={link.href}>{link.name}</Link>
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Background Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                        <motion.div
                            className="absolute bottom-20 right-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.4, 0.8, 0.4],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1,
                            }}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
