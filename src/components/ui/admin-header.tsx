import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    XIcon,
    ListIcon,
    UserIcon,
    SignOutIcon,
    GearIcon,
    ChartLineIcon,
    PackageIcon,
    UsersIcon,
    StorefrontIcon,
    BellIcon,
    MagnifyingGlassIcon,
    PlusIcon,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export default function AdminHeader() {
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

    const adminNavItems = [
        { name: "Dashboard", href: "/admin", icon: ChartLineIcon },
        { name: "Products", href: "/admin/products", icon: PackageIcon },
        { name: "Orders", href: "/admin/orders", icon: StorefrontIcon },
        { name: "Customers", href: "/admin/customers", icon: UsersIcon },
    ];

    return (
        <motion.header
            className="sticky top-0 left-0 right-0 z-50 bg-background border-b border-border/20 px-4 sm:px-8 xl:px-32"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            <div className="p-3 sm:p-4 lg:p-6">
                <div className="flex justify-between items-center h-14">
                    {/* Logo and Brand */}
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        <motion.div
                            className="w-6 h-6 bg-destructive rounded-lg flex items-center justify-center"
                            animate={{ rotate: [0, 360] }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}>
                            <span className="text-destructive-foreground font-bold text-sm">
                                A
                            </span>
                        </motion.div>
                        <div className="ml-2">
                            <span className="text-lg sm:text-xl xl:text-2xl font-bold bg-gradient-to-r from-destructive to-destructive/80 bg-clip-text text-transparent">
                                FluxOasis
                            </span>
                            <span className="block text-xs text-muted-foreground font-medium">
                                Admin Panel
                            </span>
                        </div>
                    </motion.div>

                    {/* Desktop Navigation Menu */}
                    <NavigationMenu className="hidden xl:flex">
                        <NavigationMenuList className="space-x-6 bg-muted p-1 rounded-lg">
                            {adminNavItems.map((item, index) => (
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
                                            className="text-xs font-medium flex items-center gap-2 transition-colors duration-200 p-2 px-3 text-foreground rounded-md hover:bg-foreground hover:text-background">
                                            <item.icon
                                                className="w-3 h-3"
                                                weight="regular"
                                            />
                                            <span>{item.name}</span>
                                        </Link>
                                    </motion.div>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Admin Controls */}
                    <div className="hidden xl:flex items-center space-x-3">
                        {/* Search */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search admin..."
                                    className="w-48 pl-9 h-8 text-xs bg-muted/50 border-border/30"
                                />
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}>
                            <Button
                                size="sm"
                                className="h-8 px-3 text-xs bg-primary hover:bg-primary/90">
                                <PlusIcon className="w-3 h-3 mr-1" />
                                Add Product
                            </Button>
                        </motion.div>

                        {/* Notifications */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <motion.button
                                        className="relative p-2 rounded-full hover:bg-muted/50 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}>
                                        <BellIcon
                                            className="w-4 h-4 text-foreground"
                                            weight="regular"
                                        />
                                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            5
                                        </span>
                                    </motion.button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-80">
                                    <DropdownMenuLabel>
                                        Notifications
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup className="space-y-1 py-2">
                                        <DropdownMenuItem className="text-xs">
                                            <PackageIcon
                                                className="mr-2 h-3 w-3 text-foreground"
                                                weight="fill"
                                            />
                                            <span>
                                                New order #1234 received
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-xs">
                                            <UsersIcon
                                                className="mr-2 h-3 w-3 text-foreground"
                                                weight="fill"
                                            />
                                            <span>
                                                New customer registration
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-xs">
                                            <StorefrontIcon
                                                className="mr-2 h-3 w-3 text-foreground"
                                                weight="fill"
                                            />
                                            <span>
                                                Low stock alert: Coca Cola
                                            </span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-xs text-center">
                                        View all notifications
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </motion.div>

                        {/* Admin User Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <motion.button
                                        className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}>
                                        <UserIcon
                                            className="w-4 h-4 text-foreground"
                                            weight="regular"
                                        />
                                    </motion.button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56">
                                    <DropdownMenuLabel>
                                        Admin Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <UserIcon
                                            className="mr-2 h-4 w-4 text-foreground"
                                            weight="fill"
                                        />
                                        <span>Admin Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <GearIcon
                                            className="mr-2 h-4 w-4 text-foreground"
                                            weight="fill"
                                        />
                                        <span>Admin Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <ChartLineIcon
                                            className="mr-2 h-4 w-4 text-foreground"
                                            weight="fill"
                                        />
                                        <span>Analytics</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <span className="text-xs text-muted-foreground">
                                            Switch to:
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span className="text-xs">
                                            Customer View
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <SignOutIcon
                                            className="mr-2 h-4 w-4 text-foreground"
                                            weight="fill"
                                        />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </motion.div>
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
                                        className="w-6 h-6 text-foreground"
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
                                        className="w-6 h-6 text-foreground"
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
                                {/* Mobile Search */}
                                <div className="px-4 mb-4">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search admin..."
                                            className="w-full pl-9 h-10 bg-muted/50 border-border/30"
                                        />
                                    </div>
                                </div>

                                {/* Mobile Navigation */}
                                {adminNavItems.map((item, index) => (
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
                                            className="flex items-center space-x-4 p-4 text-foreground hover:bg-foreground/2 font-medium rounded-lg transition-colors duration-200">
                                            <item.icon
                                                className="w-5 h-5"
                                                weight="regular"
                                            />
                                            <span>{item.name}</span>
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Mobile Quick Actions */}
                                <div className="pt-4 border-t border-border">
                                    <div className="px-4 space-y-2">
                                        <Button
                                            size="sm"
                                            className="w-full justify-start text-sm bg-primary hover:bg-primary/90">
                                            <PlusIcon className="w-4 h-4 mr-2" />
                                            Add Product
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full justify-start text-sm">
                                            <BellIcon className="w-4 h-4 mr-2" />
                                            Notifications (5)
                                        </Button>
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
