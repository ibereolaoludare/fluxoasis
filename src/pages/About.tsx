import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
    ArrowRightIcon,
    StarIcon,
    TruckIcon,
    ShieldIcon,
    HeartIcon,
    UsersIcon,
    PackageIcon,
    ClockIcon,
    CheckCircleIcon,
} from "@phosphor-icons/react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SEO from "@/components/SEO";
import { Link } from "wouter";

export default function About() {
    const stats = [
        {
            icon: UsersIcon,
            number: "10K+",
            label: "Happy Customers",
            description: "Satisfied customers across the city",
        },
        {
            icon: PackageIcon,
            number: "50K+",
            label: "Orders Picked Up",
            description: "Successfully picked up orders",
        },
        {
            icon: ClockIcon,
            number: "5 Min",
            label: "Average Pick Up",
            description: "Lightning fast pick up time",
        },
        {
            icon: StarIcon,
            number: "4.9",
            label: "Customer Rating",
            description: "Outstanding customer satisfaction",
        },
    ];

    const values = [
        {
            icon: HeartIcon,
            title: "Customer First",
            description:
                "We put our customers at the heart of everything we do, ensuring every interaction exceeds expectations.",
        },
        {
            icon: TruckIcon,
            title: "Fast & Reliable",
            description:
                "Lightning-fast pick up with 100% reliability. Your drinks arrive chilled and on time, every time.",
        },
        {
            icon: ShieldIcon,
            title: "Quality Assured",
            description:
                "Every product is carefully selected and quality-checked to ensure you get the best drinks possible.",
        },
        {
            icon: CheckCircleIcon,
            title: "Transparent Service",
            description:
                "Clear pricing, honest communication, and complete transparency in everything we do.",
        },
    ];

    const team = [
        {
            name: "Oludare Deborah",
            role: "Founder & CEO",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "Passionate about revolutionizing drink delivery",
        },
        {
            name: "Oludare Deborah",
            role: "Head of Operations",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "Ensuring seamless delivery operations",
        },
        {
            name: "Oludare Ibereola",
            role: "Head of Technology",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "Building the future of drink delivery",
        },
        {
            name: "Oludare Deborah",
            role: "Customer Success",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "Making every customer experience exceptional",
        },
    ];

    return (
        <>
            <SEO
                title="About Us | Fluxoasis - Our Story & Mission"
                description="Learn about Fluxoasis, our mission to deliver premium beverages in minutes, and meet our team dedicated to revolutionizing drink delivery."
                keywords="about fluxoasis, our story, drink delivery, beverage company, Nigeria, Lagos, customer service"
                url="/about"
                type="website"
            />
            <Header />
            <main className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="pb-16 px-4 sm:px-8 lg:px-16 xl:px-32">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            className="text-center mb-8 py-12"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                Our Story
                            </h1>
                            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                We're on a mission to bring your favorite drinks
                                to your doorstep in minutes, not hours. Because
                                great moments deserve great beverages.
                            </p>
                        </motion.div>

                        {/* Stats Grid */}
                        <motion.div
                            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}>
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    className="text-center p-4 bg-muted/30 rounded-xl border border-border/20"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.4 + index * 0.1,
                                    }}>
                                    <div className="w-10 h-10 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                                        <stat.icon
                                            className="w-5 h-5 text-primary"
                                            weight="fill"
                                        />
                                    </div>
                                    <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                                        {stat.number}
                                    </div>
                                    <div className="text-xs sm:text-sm font-semibold text-foreground mb-1">
                                        {stat.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 xl:px-32 bg-muted/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                                    How It All Started
                                </h2>
                                <div className="space-y-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
                                    <p>
                                        It was a hot summer day in 2023 when our
                                        founder, Alex, was craving a cold drink
                                        but couldn't find a quick way to get one
                                        delivered. That's when the idea for
                                        FluxOasis was born.
                                    </p>
                                    <p>
                                        We started with a simple mission:
                                        deliver chilled, refreshing drinks to
                                        your doorstep in under 10 minutes. What
                                        began as a small operation in one
                                        neighborhood has grown into a city-wide
                                        service that thousands of customers rely
                                        on daily.
                                    </p>
                                    <p>
                                        Today, we're proud to serve over 10,000
                                        happy customers and have delivered more
                                        than 50,000 orders. But our commitment
                                        to fast, reliable service and
                                        exceptional customer experience remains
                                        the same.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Image */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="relative">
                                <div className="relative rounded-2xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Our team delivering drinks"
                                        className="w-full h-80 sm:h-96 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 xl:px-32">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            className="text-center mb-12 sm:mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                                Our Values
                            </h2>
                            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                                The principles that guide everything we do
                            </p>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}>
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    className="text-center p-6 sm:p-8 bg-muted/30 rounded-2xl border border-border/20 hover:border-border/40 transition-all duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.4 + index * 0.1,
                                    }}
                                    viewport={{ once: true }}>
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                                        <value.icon
                                            className="w-8 h-8 sm:w-10 sm:h-10 text-primary"
                                            weight="fill"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-foreground text-lg sm:text-xl mb-4">
                                        {value.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        {value.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 xl:px-32 bg-muted/30">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            className="text-center mb-12 sm:mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                                Meet Our Team
                            </h2>
                            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                                The passionate people behind FluxOasis
                            </p>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}>
                            {team.map((member, index) => (
                                <motion.div
                                    key={member.name}
                                    className="text-center group"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.4 + index * 0.1,
                                    }}
                                    viewport={{ once: true }}>
                                    <div className="relative mb-6">
                                        <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden border-4 border-border/20 group-hover:border-primary/30 transition-colors duration-300">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-foreground text-lg sm:text-xl mb-2">
                                        {member.name}
                                    </h3>
                                    <p className="text-primary font-medium text-sm sm:text-base mb-3">
                                        {member.role}
                                    </p>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        {member.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 xl:px-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                                Ready to Experience the Difference?
                            </h2>
                            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Join thousands of satisfied customers who trust
                                FluxOasis for their drink delivery needs.
                            </p>
                            <motion.div
                                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.7 }}>
                                <motion.div
                                    className="w-full sm:w-auto"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}>
                                    <Button
                                        asChild
                                        className="w-full sm:w-auto text-sm sm:text-base !p-4 sm:!p-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full transition-all duration-300 group">
                                        <Link to="/shop">
                                            Start Shopping
                                            <ArrowRightIcon className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                        </Link>
                                    </Button>
                                </motion.div>

                                <motion.div
                                    className="w-full sm:w-auto"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}>
                                    <Button
                                        asChild
                                        className="w-full sm:w-auto text-sm sm:text-base bg-background border border-border text-foreground !p-4 sm:!p-6 hover:bg-foreground hover:text-background rounded-full transition-all duration-300 shadow-none">
                                        <Link to="/contact">Contact Us</Link>
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
