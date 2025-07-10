import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    XIcon,
    ListIcon,
    ShoppingCartIcon,
    PackageIcon,
    UserIcon,
    SignOutIcon,
    ArrowLeftIcon,
    MapPinIcon,
    ChartLineIcon,
    StorefrontIcon,
    ShieldCheckIcon,
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
import { Link, useLocation, useSearchParams } from "wouter";
import { checkUser, logOut, supabase } from "@/supabase";
import { Button } from "./button";
import { cn } from "@/lib/utils";

// Cart item interface
interface CartItem {
    id: number;
    quantity: number;
}

// Navigation item interface
interface NavigationItem {
    name: string;
    href: string;
    icon?: any;
    className?: string;
}

// Custom hook for user session
function useUserSession() {
    const [isUser, setIsUser] = useState<boolean | null | undefined>(null);
    useEffect(() => {
        let mounted = true;
        (async () => {
            const valid = await checkUser("return");
            if (mounted) setIsUser(valid);
        })();
        return () => {
            mounted = false;
        };
    }, []);
    return isUser;
}

// Custom hook for admin status
function useAdminStatus() {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (mounted && !error && data?.user) {
                    const role = data.user.user_metadata?.role;
                    setIsAdmin(role === "admin" || role === "developer");
                } else {
                    setIsAdmin(false);
                }
            } catch {
                if (mounted) setIsAdmin(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);
    return isAdmin;
}

// Custom hook for cart data
function useCartData() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState(0);

    const loadCartData = useCallback(async () => {
        try {
            // Get cart items from localStorage
            const cartItemsData: CartItem[] = JSON.parse(
                localStorage.getItem("cart-items") || "[]"
            );
            setCartItems(cartItemsData);

            if (cartItemsData.length === 0) {
                setCartTotal(0);
                return;
            }

            // Fetch product details to calculate total
            const productIds = cartItemsData.map((item) => item.id);
            const { data: products, error } = await supabase
                .from("products")
                .select("id, price")
                .in("id", productIds);

            if (error || !products) {
                setCartTotal(0);
                return;
            }

            // Calculate total
            const total = cartItemsData.reduce((sum, cartItem) => {
                const product = products.find((p) => p.id === cartItem.id);
                return sum + (product?.price || 0) * cartItem.quantity;
            }, 0);

            setCartTotal(total);
        } catch (error) {
            console.error("Error loading cart data:", error);
            setCartTotal(0);
        }
    }, []);

    useEffect(() => {
        loadCartData();

        // Listen for storage changes
        const handleStorageChange = () => {
            loadCartData();
        };

        // Listen for custom cart update event
        const handleCartUpdate = () => {
            loadCartData();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("cartUpdated", handleCartUpdate);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };
    }, [loadCartData]);

    const itemCount = useMemo(() => cartItems.length, [cartItems.length]);

    return { cartItems, cartTotal, itemCount };
}

interface HeaderProps {
    variant?: "default" | "account" | "admin";
}

// Memoized navigation items with stable reference
const useStableNavigationItems = (isAdmin: boolean | null) => {
    const baseItems: NavigationItem[] = useMemo(
        () => [
            { name: "Home", href: "/home" },
            { name: "Shop", href: "/shop" },
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
        ],
        []
    );

    const adminItem: NavigationItem = useMemo(
        () => ({
            name: "Admin",
            href: "/admin",
            icon: ShieldCheckIcon,
            className:
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        }),
        []
    );

    return useMemo((): NavigationItem[] => {
        if (isAdmin) {
            return [...baseItems, adminItem];
        }
        return baseItems;
    }, [isAdmin, baseItems, adminItem]);
};

// Memoized account sections
const useAccountSections = () => {
    return useMemo(
        () => [
            {
                id: "basic",
                name: "Profile",
                icon: UserIcon,
                path: "/account?section=basic",
            },
            {
                id: "address",
                name: "Address Book",
                icon: MapPinIcon,
                path: "/account?section=address",
            },
            {
                id: "orders",
                name: "Order History",
                icon: PackageIcon,
                path: "/account?section=orders",
            },
        ],
        []
    );
};

// Memoized admin sections
const useAdminSections = () => {
    return useMemo(
        () => [
            {
                id: "dashboard",
                name: "Dashboard",
                icon: ChartLineIcon,
                path: "/admin?section=dashboard",
            },
            {
                id: "products",
                name: "Products",
                icon: PackageIcon,
                path: "/admin?section=products",
            },
            {
                id: "orders",
                name: "Orders",
                icon: StorefrontIcon,
                path: "/admin?section=orders",
            },
        ],
        []
    );
};

// Memoized user dropdown items
const useUserDropdownItems = () => {
    return useMemo(
        () => [
            {
                icon: UserIcon,
                label: "Profile",
                to: "/account?section=basic",
            },
            {
                icon: MapPinIcon,
                label: "Address Book",
                to: "/account?section=address",
            },
            {
                icon: PackageIcon,
                label: "Orders",
                to: "/account?section=orders",
            },
        ],
        []
    );
};

// Memoized Cart Icon Component
const CartIcon = memo(function CartIcon({ itemCount }: { itemCount: number }) {
    return (
        <Link to="/cart">
            <motion.div
                className="relative p-2 rounded-full hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <ShoppingCartIcon className="w-6 h-6 text-foreground" />
                {itemCount > 0 && (
                    <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                        }}>
                        <span className="text-primary-foreground text-xs font-bold">
                            {itemCount}
                        </span>
                    </motion.div>
                )}
            </motion.div>
        </Link>
    );
});

// Memoized User Dropdown Component
const UserDropdown = memo(function UserDropdown({
    isUser,
    userDropdownItems,
}: {
    isUser: boolean | null | undefined;
    userDropdownItems: any[];
}) {
    const handleLogout = useCallback(async () => {
        await logOut();
    }, []);

    if (isUser === null) {
        return <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />;
    }

    if (!isUser) {
        return (
            <div className="flex items-center gap-2">
                <Link to="/login">
                    <Button
                        variant="outline"
                        className="rounded-full shadow-none !p-6 hover:bg-foreground hover:text-background">
                        Sign In
                    </Button>
                </Link>
                <Link to="/signup">
                    <Button
                        className="rounded-full !p-6 bg-foreground text-background hover:bg-foreground/90">
                        Sign Up
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.div
                    className="relative p-2 rounded-full hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    <UserIcon className="w-6 h-6 text-foreground" />
                </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {userDropdownItems.map((item) => (
                        <DropdownMenuItem key={item.label}>
                            <Link
                                to={item.to}
                                className="flex items-center">
                                <item.icon className="w-4 h-4 mr-2" />
                                {item.label}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <SignOutIcon className="w-4 h-4 mr-2" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
});

// Memoized Mobile Cart Component
const MobileCart = memo(function MobileCart({
    itemCount,
}: {
    itemCount: number;
}) {
    return (
        <Link to="/cart">
            <motion.button
                className="flex items-center space-x-3 text-sm p-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <ShoppingCartIcon
                    className="w-6 h-6 text-foreground"
                    weight="regular"
                />
                <span className="text-foreground font-medium">
                    Cart ({itemCount})
                </span>
            </motion.button>
        </Link>
    );
});

// Memoized Mobile User Actions Component
const MobileUserActions = memo(function MobileUserActions({
    isUser,
    itemCount,
}: {
    isUser: boolean | null | undefined;
    itemCount: number;
}) {
    if (isUser === null) {
        return null;
    }

    if (isUser) {
        return (
            <div className="flex items-center justify-between">
                <MobileCart itemCount={itemCount} />
                <Link to="/account">
                    <motion.button
                        className="flex items-center space-x-3 p-3 text-sm rounded-lg transition-colors"
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
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-2">
            <Link
                to="/cart"
                className="w-full">
                <Button
                    className="w-full flex items-center gap-2 p-6 hover:bg-accent hover:text-accent-foreground rounded-full"
                    variant="outline">
                    <ShoppingCartIcon
                        className="w-6 h-6"
                        weight="regular"
                    />
                    <span>Cart ({itemCount})</span>
                </Button>
            </Link>
            <Link
                to="/login"
                className="w-full">
                <Button
                    className="w-full flex items-center gap-2 p-6 hover:bg-primary hover:text-background rounded-full"
                    variant="outline">
                    Log In
                </Button>
            </Link>
            <Link
                to="/signup"
                className="w-full">
                <Button className="w-full flex items-center gap-2 p-6 rounded-full text-background bg-foreground hover:bg-foreground/90">
                    Sign Up
                </Button>
            </Link>
        </div>
    );
});

const Header = memo(function Header({ variant = "default" }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentScroll, setCurrentScroll] = useState(0);
    const isUser = useUserSession();
    const isAdmin = useAdminStatus();
    const { itemCount } = useCartData();
    const [searchParams] = useSearchParams();
    const [location, setLocation] = useLocation();

    // Memoized navigation items
    const navItems = useStableNavigationItems(isAdmin);
    const accountSections = useAccountSections();
    const adminSections = useAdminSections();
    const userDropdownItems = useUserDropdownItems();

    // Set initial scroll position when component loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Lock scroll when mobile menu is open
    if (isMenuOpen) {
        document.body.style.overflow = "hidden";
        window.scrollTo(0, 0);
    } else {
        document.body.style.overflow = "auto";
        window.scrollTo(0, currentScroll);
    }

    // Get active section from search params
    const activeSection = searchParams.get("section") || "basic";

    // Function to update URL with section parameter
    const updateSection = useCallback(
        (sectionId: string) => {
            const newSearchParams = new URLSearchParams(location.split("?")[1]);
            newSearchParams.set("section", sectionId);
            const newQuery = newSearchParams.toString();
            const newPath = newQuery ? `?${newQuery}` : "";
            setLocation(`/account${newPath}`);
        },
        [location, setLocation]
    );

    // Memoized menu toggle handler
    const toggleMenu = useCallback(() => {
        setIsMenuOpen(!isMenuOpen);
        setCurrentScroll(window.scrollY);
    }, [isMenuOpen]);

    // Memoized section click handler

    // Account variant header
    if (variant === "account") {
        return (
            <motion.header
                className="sticky top-0 left-0 right-0 z-50 bg-background px-4 sm:px-8 xl:px-32"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}>
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo Section */}
                        <Link to="/home">
                            <motion.div
                                className="flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}>
                                <motion.button
                                    className="p-2 rounded-full hover:bg-muted/50 transition-colors mr-3"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}>
                                    <ArrowLeftIcon className="w-5 h-5 text-foreground" />
                                </motion.button>
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
                        </Link>

                        {/* Account Navigation Menu */}
                        <NavigationMenu className="hidden xl:flex">
                            <NavigationMenuList className="space-x-2 bg-muted p-2 rounded-full">
                                {accountSections.map((section, index) => {
                                    const Icon = section.icon;
                                    return (
                                        <NavigationMenuItem
                                            key={section.id}
                                            className="hover:bg-transparent">
                                            <motion.div
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.1 + index * 0.1,
                                                }}>
                                                <button
                                                    onClick={() =>
                                                        updateSection(
                                                            section.id
                                                        )
                                                    }
                                                    className={cn(
                                                        "text-xs font-medium flex items-center transition-colors duration-200 p-2 px-3 rounded-full",
                                                        activeSection ===
                                                            section.id
                                                            ? "bg-foreground text-background"
                                                            : "text-foreground hover:bg-foreground hover:text-background"
                                                    )}>
                                                    <Icon className="w-4 h-4 mr-2" />
                                                    <span>{section.name}</span>
                                                </button>
                                            </motion.div>
                                        </NavigationMenuItem>
                                    );
                                })}
                            </NavigationMenuList>
                        </NavigationMenu>

                        {/* User Actions */}

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="xl:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            onClick={toggleMenu}
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
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}>
                                <div className="py-4 space-y-2 border-t border-border">
                                    {/* Mobile Account Sections */}
                                    {accountSections.map((section, index) => {
                                        const Icon = section.icon;
                                        return (
                                            <motion.div
                                                key={section.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: 0.1 + index * 0.1,
                                                }}
                                                onClick={() => {
                                                    updateSection(section.id);
                                                    setIsMenuOpen(false);
                                                }}>
                                                <button
                                                    className={cn(
                                                        "w-full flex items-center space-x-4 p-6 text-foreground text-sm hover:bg-foreground/2 font-bold rounded-full transition-colors duration-200",
                                                        activeSection ===
                                                            section.id
                                                            ? "bg-primary text-primary-foreground hover:bg-primary"
                                                            : ""
                                                    )}>
                                                    <Icon className="w-5 h-5" />
                                                    <span>{section.name}</span>
                                                </button>
                                            </motion.div>
                                        );
                                    })}

                                    {/* Mobile User Actions */}
                                    <div className="border-border">
                                        <div className="flex flex-col gap-2">
                                            {isUser && (
                                                <div className="flex items-center justify-between">
                                                    <button
                                                        className="w-full flex items-center space-x-4 p-6 text-foreground text-sm hover:bg-foreground/2 font-bold rounded-full transition-colors duration-200"
                                                        onClick={() => {
                                                            logOut();
                                                            setIsMenuOpen(
                                                                false
                                                            );
                                                        }}>
                                                        <SignOutIcon className="w-5 h-5" />
                                                        <span>Log Out</span>
                                                    </button>
                                                </div>
                                            )}
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

    // Admin variant header
    if (variant === "admin") {
        return (
            <motion.header
                className="sticky top-0 left-0 right-0 z-50 bg-background px-4 sm:px-8 xl:px-32"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}>
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo Section */}
                        <Link to="/account">
                            <motion.div
                                className="flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}>
                                <motion.button
                                    className="p-2 rounded-full hover:bg-destructive/10 transition-colors mr-3"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}>
                                    <ArrowLeftIcon className="w-5 h-5 text-destructive" />
                                </motion.button>
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
                                <span className="ml-2 text-xl sm:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-destructive to-destructive/80 bg-clip-text text-transparent">
                                    FluxOasis
                                </span>
                                <span className="ml-2 text-xs text-muted-foreground font-medium hidden sm:inline">
                                    Admin Panel
                                </span>
                            </motion.div>
                        </Link>

                        {/* Admin Navigation Menu */}
                        <NavigationMenu className="hidden xl:flex">
                            <NavigationMenuList className="space-x-2 bg-muted p-2 rounded-full">
                                {adminSections.map((section, index) => {
                                    const Icon = section.icon;
                                    return (
                                        <NavigationMenuItem
                                            key={section.id}
                                            className="hover:bg-transparent">
                                            <motion.div
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.1 + index * 0.1,
                                                }}>
                                                <Link
                                                    to={section.path}
                                                    className={cn(
                                                        "text-xs font-medium flex items-center transition-colors duration-200 p-2 px-3 rounded-full",
                                                        (searchParams.get(
                                                            "section"
                                                        ) || "dashboard") ===
                                                            section.id
                                                            ? "bg-destructive text-destructive-foreground"
                                                            : "text-foreground hover:bg-destructive hover:text-destructive-foreground"
                                                    )}>
                                                    <Icon className="w-4 h-4 mr-2" />
                                                    <span>{section.name}</span>
                                                </Link>
                                            </motion.div>
                                        </NavigationMenuItem>
                                    );
                                })}
                            </NavigationMenuList>
                        </NavigationMenu>
                        {/* Mobile Menu Button */}
                        <motion.button
                            className="xl:hidden p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                            onClick={toggleMenu}
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
                                            className="w-8 h-8 text-destructive"
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
                                            className="w-8 h-8 text-destructive"
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
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}>
                                <div className="py-4 space-y-2 border-t border-border">
                                    {adminSections.map((section, index) => {
                                        const Icon = section.icon;
                                        return (
                                            <motion.div
                                                key={section.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: 0.1 + index * 0.1,
                                                }}>
                                                <Link
                                                    to={section.path}
                                                    className={cn(
                                                        "w-full flex items-center space-x-4 p-6 text-destructive text-sm hover:bg-destructive/10 font-bold rounded-full transition-colors duration-200",
                                                        (searchParams.get(
                                                            "section"
                                                        ) || "dashboard") ===
                                                            section.id
                                                            ? "bg-destructive text-destructive-foreground hover:bg-destructive"
                                                            : ""
                                                    )}>
                                                    <Icon className="w-5 h-5" />
                                                    <span>{section.name}</span>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.header>
        );
    }

    // Default header
    return (
        <motion.header
            className="sticky top-0 left-0 right-0 z-50 bg-background px-4 sm:px-8 xl:px-32"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <Link to="/home">
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
                    </Link>

                    {/* Desktop Navigation Menu */}
                    <NavigationMenu className="hidden xl:flex">
                        <NavigationMenuList className="space-x-8 bg-muted p-2 rounded-full">
                            {navItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <NavigationMenuItem
                                        className="hover:bg-transparent"
                                        key={`nav-${item.name}`}>
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.1,
                                            }}>
                                            <Link
                                                to={item.href}
                                                className={cn(
                                                    "text-xs font-medium flex items-center transition-colors duration-200 p-2 px-4 rounded-full",
                                                    item.className ||
                                                        "text-foreground hover:bg-foreground hover:text-background"
                                                )}>
                                                {Icon && (
                                                    <Icon className="w-4 h-4 mr-2" />
                                                )}
                                                <span>{item.name}</span>
                                            </Link>
                                        </motion.div>
                                    </NavigationMenuItem>
                                );
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Desktop User and Cart Dropdowns */}
                    <div className="hidden xl:flex items-center space-x-4">
                        {/* Cart Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}>
                            <CartIcon itemCount={itemCount} />
                        </motion.div>

                        {/* User Dropdown or Auth Buttons */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}>
                            <UserDropdown
                                isUser={isUser}
                                userDropdownItems={userDropdownItems}
                            />
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="xl:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        onClick={toggleMenu}
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
                                {/* Mobile Navigation Items */}
                                {navItems.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={`mobile-nav-${item.name}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.1,
                                            }}>
                                            <Link
                                                to={item.href}
                                                className={cn(
                                                    "flex items-center space-x-4 p-6 font-bold rounded-full transition-colors duration-200 text-sm",
                                                    item.className ||
                                                        "text-foreground hover:bg-primary hover:text-background"
                                                )}>
                                                {Icon && (
                                                    <Icon className="w-5 h-5" />
                                                )}
                                                <span>{item.name}</span>
                                            </Link>
                                        </motion.div>
                                    );
                                })}

                                {/* Mobile User Actions and Cart */}
                                <div className="pt-4 border-t border-border">
                                    <div className="flex flex-col gap-2 p-4 sm:px-32 md:px-16">
                                        <MobileUserActions
                                            isUser={isUser}
                                            itemCount={itemCount}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
});

export default Header;
