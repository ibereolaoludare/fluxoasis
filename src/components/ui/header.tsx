import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    XIcon,
    ListIcon,
    ShoppingCartIcon,
    PackageIcon,
    HeartIcon,
    UserIcon,
    SignOutIcon,
    GearIcon,
} from "@phosphor-icons/react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { checkUser, logOut } from "@/supabase";
import { Button } from "./button";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentScroll, setCurrentScroll] = useState(0);

    // Set initial scroll position when component loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isMenuOpen) {
        document.body.style.overflow = "hidden";
        window.scrollTo(0, 0);
    } else {
        document.body.style.overflow = "auto";
        window.scrollTo(0, currentScroll);
    }

    const navItems = [
        { name: "Home", href: "home" },
        { name: "Shop", href: "shop" },
        { name: "About", href: "about" },
        { name: "Contact", href: "contact" },
    ];

    return (
        <motion.header
            className="sticky top-0 left-0 right-0 z-50 bg-background px-4 sm:px-8 xl:px-32"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        <motion.div
                            className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center"
                            animate={{ rotate: [0, 360] }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}>
                            <span className="text-primary-foreground font-bold text-sm">
                                F
                            </span>
                        </motion.div>
                        <span className="ml-2 text-xl sm:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            FluxOasis
                        </span>
                    </motion.div>

                    {/* Desktop Navigation Menu */}
                    <NavigationMenu className="hidden xl:flex">
                        <NavigationMenuList className="space-x-8 bg-muted p-2 rounded-full">
                            {navItems.map((item, index) => (
                                <NavigationMenuItem
                                    className="hover:bg-transparent"
                                    key={item.name}>
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1,
                                        }}>
                                        <Link
                                            to={item.href}
                                            className="text-xs font-medium flex items-center transition-colors duration-200 p-2 px-4 text-foreground rounded-full hover:bg-foreground hover:text-background">
                                            <span>{item.name}</span>
                                        </Link>
                                    </motion.div>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* User and Cart Dropdowns */}
                    <div className="hidden xl:flex items-center space-x-4">
                        {/* Cart Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <motion.button
                                        className="relative p-3 rounded-full hover:bg-muted/50 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}>
                                        <ShoppingCartIcon
                                            className="w-5 h-5 text-foreground"
                                            weight="regular"
                                        />
                                        <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            3
                                        </span>
                                    </motion.button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-64">
                                    <DropdownMenuLabel>
                                        Shopping Cart
                                    </DropdownMenuLabel>
                                    {/* <DropdownMenuSeparator /> */}
                                    <DropdownMenuGroup className="space-y-2 py-2">
                                        <DropdownMenuItem>
                                            <PackageIcon
                                                className="mr-2 h-4 w-4 text-foreground"
                                                weight="fill"
                                            />
                                            <span>View Cart (3 items)</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <HeartIcon
                                                className="mr-2 h-4 w-4 text-foreground"
                                                weight="fill"
                                            />
                                            <span>Wishlist</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup className="p-4 py-2 text-sm">
                                        <span className="font-semibold">
                                            Total: $299.99
                                        </span>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </motion.div>

                        {/* User Dropdown */}
                        {(() => {
                            const [isUser, setIsUser] = useState<boolean | null | undefined>(null);

                            useEffect(() => {
                                let mounted = true;
                                (async () => {
                                    const valid = await checkUser("return");
                                    if (mounted) setIsUser(valid);
                                })();
                                return () => { mounted = false; };
                            }, []);

                            if (isUser === null) {
                                // Loading state, can show a skeleton or nothing
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}>
                                        <div className="p-3 rounded-full bg-muted/30 animate-pulse w-10 h-10" />
                                    </motion.div>
                                );
                            }

                            if (isUser) {
                                // User is authenticated, show dropdown
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <motion.button
                                                    className="p-3 rounded-full hover:bg-muted/50 transition-colors"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}>
                                                    <UserIcon
                                                        className="w-5 h-5 text-foreground"
                                                        weight="regular"
                                                    />
                                                </motion.button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-56">
                                                <DropdownMenuLabel>
                                                    My Account
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <UserIcon className="mr-2 h-4 w-4 text-foreground" weight="fill" />
                                                    <span>Profile</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <PackageIcon className="mr-2 h-4 w-4 text-foreground" weight="fill" />
                                                    <span>Orders</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <HeartIcon className="mr-2 h-4 w-4 text-foreground" weight="fill" />
                                                    <span>Favorites</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <GearIcon className="mr-2 h-4 w-4 text-foreground" weight="fill" />
                                                    <span>Settings</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={logOut}>
                                                    <SignOutIcon className="mr-2 h-4 w-4 text-foreground" weight="fill" />
                                                    <span>Sign Out</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </motion.div>
                                );
                            }

                            // User is not authenticated, show Sign Up and Log In buttons
                            return (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="flex gap-2"
                                >
                                    <Link href="/signup">
                                        <Button className="rounded-full hover:bg-foreground/90 bg-foreground text-background p-5">
                                            Sign Up
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button className="rounded-full p-5 shadow-none hover:bg-primary hover:text-background" variant="outline">
                                            Log In
                                        </Button>
                                    </Link>
                                </motion.div>
                            );
                        })()}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="xl:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        onClick={() => {
                            setIsMenuOpen(!isMenuOpen);
                            setCurrentScroll(window.scrollY);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}>
                        <AnimatePresence mode="wait">
                            {isMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}>
                                    <XIcon
                                        className="w-8 h-8 text-foreground"
                                        weight="regular"
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}>
                                    <ListIcon
                                        className="w-8 h-8 text-foreground"
                                        weight="regular"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="xl:hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "100dvh" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}>
                            <div className="py-4 space-y-2 border-t border-border">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.1,
                                        }}
                                        onClick={() => setIsMenuOpen(false)}>
                                        <Link
                                            to={item.href}
                                            className="flex items-center space-x-4 p-6 text-foreground hover:bg-foreground/2 font-bold rounded-lg transition-colors duration-200">
                                            <span>{item.name}</span>
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Mobile User Actions */}
                                <div className="pt-4 border-t border-border">
                                    <div className="flex items-center justify-between p-4">
                                        <motion.button
                                            className="flex items-center space-x-3 p-3 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}>
                                            <ShoppingCartIcon
                                                className="w-6 h-6 text-foreground"
                                                weight="regular"
                                            />
                                            <span className="text-foreground font-medium">
                                                Cart (3)
                                            </span>
                                        </motion.button>
                                        <motion.button
                                            className="flex items-center space-x-3 p-3 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}>
                                            <UserIcon
                                                className="w-6 h-6 text-foreground"
                                                weight="regular"
                                            />
                                            <span className="text-foreground font-medium">
                                                Account
                                            </span>
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
}
