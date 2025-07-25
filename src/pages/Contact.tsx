import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ClockIcon,
    CheckCircleIcon,
    PaperPlaneIcon,
} from "@phosphor-icons/react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SEO from "@/components/SEO";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const contactInfo = [
        {
            icon: PhoneIcon,
            title: "Phone",
            value: "+234 803 917 0390",
            description: "Call us anytime",
            href: "tel:+2348039170390",
        },
        {
            icon: EnvelopeIcon,
            title: "Email",
            value: "debbietaiye@gmail.com",
            description: "Send us an email",
            href: "mailto:debbietaiye@gmail.com",
        },
        {
            icon: MapPinIcon,
            title: "Address",
            value: "Abuja, Nigeria",
            description: "Visit our office",
            href: "https://g.co/kgs/YkP91kv",
        },
        {
            icon: ClockIcon,
            title: "Business Hours",
            value: "24/7 Available",
            description: "We're always here for you",
            href: "https://g.co/kgs/YkP91kv",
        },
    ];

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset form after showing success message
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        }, 3000);
    };

    return (
        <>
            <SEO
                title="Contact Us | Fluxoasis - Get in Touch"
                description="Get in touch with Fluxoasis. We're here to help with any questions about our premium beverages and delivery service. Contact us today!"
                keywords="contact fluxoasis, customer support, help, customer service, Nigeria, Lagos, beverage delivery"
                url="/contact"
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
                                Get in Touch
                            </h1>
                            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                Have questions? We'd love to hear from you. Send
                                us a message and we'll respond as soon as
                                possible.
                            </p>
                        </motion.div>

                        {/* Contact Info Grid */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}>
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={info.title}
                                    className="text-center p-4 bg-muted/30 rounded-xl border border-border/20 hover:border-border/40 transition-all duration-300 group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.4 + index * 0.1,
                                    }}>
                                    <div className="w-10 h-10 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                                        <info.icon
                                            className="w-5 h-5 text-primary"
                                            weight="fill"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-foreground text-base mb-1">
                                        {info.title}
                                    </h3>
                                    <a
                                        href={info.href}
                                        className="text-primary font-medium text-sm mb-1 block hover:text-primary/80 transition-colors duration-200">
                                        {info.value}
                                    </a>
                                    <p className="text-muted-foreground text-sm">
                                        {info.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 xl:px-32 bg-muted/30">
                    <div>
                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                                Send us a Message
                            </h2>
                            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                                Fill out the form below and we'll get back to
                                you as soon as possible.
                            </p>
                        </motion.div>

                        <motion.div
                            className="grid lg:grid-cols-2 gap-8 lg:gap-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}>
                            {/* Contact Form */}
                            <div className="bg-background rounded-xl p-4 sm:p-6 border border-border/20">
                                {isSubmitted ? (
                                    <motion.div
                                        className="text-center py-12"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}>
                                        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircleIcon
                                                className="w-8 h-8 text-green-600"
                                                weight="fill"
                                            />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground mb-4">
                                            Message Sent!
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Thank you for your message. We'll
                                            get back to you soon.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label
                                                    htmlFor="name"
                                                    className="block font-medium text-foreground mb-2">
                                                    Name *
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Your name"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor="email"
                                                    className="block font-medium text-foreground mb-2">
                                                    Email *
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="your@email.com"
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="subject"
                                                className="block font-medium text-foreground mb-2">
                                                Subject *
                                            </Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                placeholder="What's this about?"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="message"
                                                className="block font-medium text-foreground mb-2">
                                                Message *
                                            </Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                required
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                placeholder="Tell us more..."
                                                rows={6}
                                                className="w-full resize-none"
                                            />
                                        </div>

                                        <motion.div
                                            className="w-full sm:w-auto"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full sm:w-auto text-sm sm:text-base !p-4 sm:!p-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed">
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin mr-2" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        Send Message
                                                        <PaperPlaneIcon className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>
                                    </form>
                                )}
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-6 max-sm:px-2">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-3">
                                        Why Choose FluxOasis?
                                    </h3>
                                    <div className="space-y-3 text-muted-foreground">
                                        <p>
                                            We're committed to providing
                                            exceptional customer service and
                                            ensuring your experience with us is
                                            nothing short of amazing.
                                        </p>
                                        <p>
                                            Whether you have questions about our
                                            products, need help with an order,
                                            or want to provide feedback, we're
                                            here to help.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">
                                        Response Time
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-muted-foreground">
                                                Email: Within 2 hours
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-muted-foreground">
                                                Phone: Immediate
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-muted-foreground">
                                                Social Media: Within 1 hour
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">
                                        Business Hours
                                    </h3>
                                    <div className="space-y-2 text-muted-foreground">
                                        <p>
                                            <strong>Monday - Friday:</strong>{" "}
                                            8:00 AM - 10:00 PM
                                        </p>
                                        <p>
                                            <strong>Saturday:</strong> 9:00 AM -
                                            11:00 PM
                                        </p>
                                        <p>
                                            <strong>Sunday:</strong> 10:00 AM -
                                            9:00 PM
                                        </p>
                                        <p className="text-primary font-medium">
                                            24/7 Online Support Available
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 xl:px-32">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-base sm:text-lg text-muted-foreground">
                                Quick answers to common questions
                            </p>
                        </motion.div>

                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}>
                            {[
                                {
                                    question: "How fast is your pick up?",
                                    answer: "We pick up within 5-10 minutes in most areas. Our goal is to get your drinks to you as quickly as possible while maintaining quality.",
                                },
                                {
                                    question: "What areas do you serve?",
                                    answer: "We currently serve Abuja, Nigeria with plans to expand to other cities. Check our app or website to see if we deliver to your area.",
                                },
                                {
                                    question: "Can I track my order?",
                                    answer: "Yes! You'll receive real-time updates on your order status, including when it's being prepared and when it's on its way to you.",
                                },
                                {
                                    question:
                                        "What if I'm not satisfied with my order?",
                                    answer: "We stand behind our service 100%. If you're not completely satisfied, contact us immediately and we'll make it right.",
                                },
                            ].map((faq, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-muted/30 rounded-xl p-4 border border-border/20"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.4 + index * 0.1,
                                    }}
                                    viewport={{ once: true }}>
                                    <h3 className="font-semibold text-foreground text-base mb-2">
                                        {faq.question}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {faq.answer}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
