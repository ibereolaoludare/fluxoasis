import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    House,
    EnvelopeIcon,
    StorefrontIcon,
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
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: "Home", icon: House, href: "home" },
        { name: "Shop", icon: StorefrontIcon, href: "about" },
        { name: "About", icon: GearIcon, href: "services" },
        { name: "Contact", icon: EnvelopeIcon, href: "contact" },
    ];

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 bg-background px-4 sm:px-8 xl:px-32"
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
                            className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
                            animate={{ rotate: [0, 360] }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}>
                            <span className="text-primary-foreground font-bold">
                                F
                            </span>
                        </motion.div>
                        <span className="ml-3 text-2xl sm:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            FluxOasis
                        </span>
                    </motion.div>

                    {/* Desktop Navigation Menu */}
                    <NavigationMenu className="hidden xl:flex">
                        <NavigationMenuList className="space-x-12 bg-muted p-2 px-2 rounded-full">
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
                                            className="text-sm font-medium flex items-center transition-colors duration-200 p-2 px-6 text-foreground rounded-full hover:bg-foreground hover:text-background">
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
                                            className="w-6 h-6 text-foreground"
                                            weight="regular"
                                        />
                                        <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <PackageIcon className="mr-2 h-4 w-4" />
                                        <span>View Cart (3 items)</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <HeartIcon className="mr-2 h-4 w-4" />
                                        <span>Wishlist</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <span className="font-semibold">
                                            Total: $299.99
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </motion.div>

                        {/* User Dropdown */}
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
                                            className="w-6 h-6 text-foreground"
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
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <PackageIcon className="mr-2 h-4 w-4" />
                                        <span>Orders</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <HeartIcon className="mr-2 h-4 w-4" />
                                        <span>Favorites</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <GearIcon className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <SignOutIcon className="mr-2 h-4 w-4" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="xl:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
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
