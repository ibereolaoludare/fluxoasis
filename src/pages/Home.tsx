import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { motion } from "motion/react";
import {
    ArrowRightIcon,
    StarIcon,
    ClockIcon,
    ShieldIcon,
    ShoppingCartIcon,
    TruckIcon,
    LockIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ProductCard from "@/components/ui/product-card";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import type { Tables } from "@/supabase.type";

export default function Home() {
    const drinkImages = [
        {
            src: "/images/coke.png",
            alt: "Coca Cola",
            delay: 0,
            position: "top-10 left-10",
        },
        {
            src: "/images/fanta.png",
            alt: "Fanta",
            delay: 0.5,
            position: "top-10 sm:top-40 right-20",
        },
        {
            src: "/images/pepsi.png",
            alt: "Pepsi",
            delay: 1,
            position: "bottom-5 sm:bottom-40 left-1/6",
        },
        {
            src: "/images/sprite.png",
            alt: "Sprite",
            delay: 1,
            position: "bottom-10 sm:bottom-20 right-1/6",
        },
    ];

    const features = [
        {
            icon: ClockIcon,
            title: "5 Min Delivery",
            description: "Lightning fast delivery",
        },
        {
            icon: ShieldIcon,
            title: "100% Fresh",
            description: "Always chilled & fresh",
        },
        {
            icon: StarIcon,
            title: "4.9 Rating",
            description: "From 10k+ customers",
        },
    ];

    const categories = [
        {
            name: "Soft Drinks",
            image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            count: "50+",
            color: "from-red-500 to-red-600",
            bgColor: "bg-red-50",
        },
        {
            name: "Energy",
            image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            count: "25+",
            color: "from-yellow-500 to-orange-500",
            bgColor: "bg-yellow-50",
        },
        {
            name: "Juice",
            image: "https://plus.unsplash.com/premium_photo-1667543228378-ec4478ab2845?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            count: "30+",
            color: "from-orange-500 to-pink-500",
            bgColor: "bg-orange-50",
        },
        {
            name: "Water",
            image: "https://images.unsplash.com/photo-1616118132534-381148898bb4?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            count: "15+",
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
        },
    ];

    const [featuredProducts, setFeaturedProducts] = useState<
        Tables<"products">[]
    >([]);
    const [loading, setLoading] = useState(true);

    // Fetch first 3 products from database
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("products")
                    .select("*")
                    .order("id", { ascending: true })
                    .limit(3);

                if (error) {
                    console.error("Error fetching featured products:", error);
                } else {
                    setFeaturedProducts(data || []);
                }
            } catch (error) {
                console.error("Error fetching featured products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const whyChooseUs = [
        {
            icon: TruckIcon,
            title: "Fast Delivery",
            description: "Get your drinks delivered in minutes, not hours",
        },
        {
            icon: ShoppingCartIcon,
            title: "Easy Checkout",
            description: "Simple, secure, and hassle-free ordering process",
        },
        {
            icon: LockIcon,
            title: "Secure Payments",
            description: "Your payment information is always protected",
        },
    ];

    return (
        <>
            <Header />
            <main className="flex flex-col justify-between w-full">
                {/* Hero Section */}
                <section className="relative min-h-[80dvh] flex items-center justify-center px-4 sm:px-8 lg:px-16 xl:px-32">
                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
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
                            className="absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-2xl"
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
                        <motion.div
                            className="absolute bottom-40 left-1/4 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 2,
                            }}
                        />

                        {/* Additional background elements */}
                        <motion.div
                            className="absolute top-1/3 left-1/2 w-16 h-16 bg-accent/30 rounded-full blur-xl"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.2, 0.6, 0.2],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5,
                            }}
                        />
                        <motion.div
                            className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-primary/20 rounded-full blur-2xl"
                            animate={{
                                scale: [1.5, 1, 1.5],
                                opacity: [0.3, 0.7, 0.3],
                            }}
                            transition={{
                                duration: 3.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1.5,
                            }}
                        />
                    </div>

                    {/* Floating Drink Images */}
                    {drinkImages.map((drink, index) => (
                        <motion.div
                            key={index}
                            className={`absolute ${drink.position} lg:block`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0.3, 0.8, 0.3],
                                scale: [0.8, 1, 0.8],
                                y: [0, -20, 0],
                                rotate: [0, 5, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: drink.delay,
                            }}>
                            <div className="relative">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-lg border-4 border-white overflow-hidden">
                                    <img
                                        src={drink.src}
                                        alt={drink.alt}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <motion.div
                                    className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: drink.delay + 1,
                                    }}>
                                    <span className="text-primary-foreground text-xs font-bold">
                                        +
                                    </span>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Main Content */}
                    <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-0">
                        {/* Main Heading */}
                        <motion.h1
                            className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-3 sm:mb-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}>
                            Your Favorite{" "}
                            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                Drinks
                            </span>
                            , <br className="hidden sm:block" />
                            Delivered Fast
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}>
                            Order chilled, refreshing drinks straight to your
                            door in{" "}
                            <span className="font-semibold text-foreground">
                                minutes
                            </span>
                            .
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8 px-4 sm:px-0"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}>
                            <motion.div
                                className="w-full sm:w-auto"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}>
                                <Button
                                    asChild
                                    className="w-full sm:w-auto text-sm sm:text-base !p-6 sm:!p-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full transition-all duration-300 group">
                                    <Link to="/shop">
                                        Shop Now
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
                                    className="w-full sm:w-auto text-sm sm:text-base bg-background border border-border text-foreground !p-6 sm:!p-6 hover:bg-foreground hover:text-background rounded-full transition-all duration-300 shadow-none">
                                    <Link to="/about">Learn More</Link>
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Features Grid */}
                        <motion.div
                            className="hidden md:flex flex-wrap justify-center lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 max-w-5xl mx-auto"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.3 }}>
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    className="flex flex-col items-center text-center p-3 sm:p-4 bg-background/30 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-accent/10 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 1.5 + index * 0.1,
                                    }}>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                                        <feature.icon
                                            className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
                                            weight="fill"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-1 text-xs sm:text-sm">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 2 }}>
                        <motion.div
                            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}>
                            <motion.div
                                className="w-1 h-3 bg-muted-foreground/60 rounded-full mt-2"
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                    </motion.div>
                </section>

                {/* Categories Preview Section */}
                <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 xl:px-32 bg-background">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Heading */}
                        <motion.div
                            className="text-center mb-8 sm:mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                                Shop by Category
                            </h2>
                            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                                Explore our wide selection of refreshing drinks
                                organized by category
                            </p>
                        </motion.div>

                        {/* Categories Grid */}
                        <motion.div
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}>
                            {categories.map((category, index) => (
                                <Link
                                    key={category.name}
                                    to="/shop">
                                    <motion.div
                                        className="group relative overflow-hidden rounded-xl bg-background transition-all duration-300 cursor-pointer"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.4 + index * 0.1,
                                        }}
                                        viewport={{ once: true }}>
                                        {/* Background Gradient */}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                                        />

                                        {/* Content */}
                                        <div className="relative p-4 sm:p-6 text-center">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 shadow-xs rounded-full overflow-hidden">
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">
                                                {category.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mb-3">
                                                {category.count} options
                                            </p>

                                            {/* Hover Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Arrow Icon */}
                                            <motion.div
                                                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                initial={{ x: 10 }}
                                                whileHover={{ x: 0 }}
                                                transition={{ duration: 0.2 }}>
                                                <ArrowRightIcon className="w-4 h-4 text-primary" />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>

                        {/* View All Button */}
                        <motion.div
                            className="text-center mt-8 sm:mt-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true }}>
                            <Button
                                asChild
                                className="sm:w-auto text-sm sm:text-base !p-4 sm:!p-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full transition-all duration-300 group">
                                <Link to="/shop">
                                    View All Categories
                                    <ArrowRightIcon className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>

                {/* Featured Products Section */}
                <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 xl:px-32 bg-background">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Heading */}
                        <motion.div
                            className="text-center mb-8 sm:mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                                Top Picks for You
                            </h2>
                            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                                Discover our most popular drinks, handpicked for
                                you
                            </p>
                        </motion.div>

                        {/* Products Grid */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}>
                            {loading
                                ? // Loading skeleton
                                  Array.from({ length: 3 }).map((_, index) => (
                                      <motion.div
                                          key={index}
                                          className="bg-muted/30 rounded-2xl p-4 animate-pulse"
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: index * 0.1 }}>
                                          <div className="h-48 bg-muted rounded-xl mb-4"></div>
                                          <div className="space-y-2">
                                              <div className="h-4 bg-muted rounded w-3/4"></div>
                                              <div className="h-4 bg-muted rounded w-1/2"></div>
                                              <div className="h-4 bg-muted rounded w-1/4"></div>
                                          </div>
                                      </motion.div>
                                  ))
                                : featuredProducts.map((product) => (
                                      <ProductCard
                                          key={product.id}
                                          {...product}
                                      />
                                  ))}
                        </motion.div>

                        {/* View All Products Button */}
                        <motion.div
                            className="text-center mt-8 sm:mt-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true }}>
                            <Button
                                asChild
                                className="text-sm sm:text-base !p-4 sm:!p-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full transition-all duration-300 group">
                                <Link to="/shop">
                                    View All Products
                                    <ArrowRightIcon className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 xl:px-32 bg-background">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Heading */}
                        <motion.div
                            className="text-center mb-8 sm:mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                                Why We're Different
                            </h2>
                            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                                Experience the difference with our unique
                                approach to drink delivery
                            </p>
                        </motion.div>

                        {/* Features Grid */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}>
                            {whyChooseUs.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    className="group bg-muted rounded-xl p-4 sm:p-6 text-center border border-border/20 hover:border-border/40 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.4 + index * 0.1,
                                    }}
                                    viewport={{ once: true }}>
                                    {/* Icon */}
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                                        <feature.icon
                                            className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
                                            weight="fill"
                                        />
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
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
