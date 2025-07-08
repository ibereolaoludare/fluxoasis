import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
    UserIcon,
    CreditCardIcon,
    SignOutIcon,
    TrashIcon,
    PlusIcon,
    PencilIcon,
    XIcon,
    CheckIcon,
    MapPinIcon,
    PackageIcon,
    BellIcon,
    CoffeeIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "wouter";
import Header from "@/components/ui/header";
import { checkUser } from "@/supabase";
import { navigate } from "wouter/use-browser-location";

// Profile Section Component
function ProfileSection() {
    const [isEditing, setIsEditing] = useState(false);

    const userInfo = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        username: "johndoe",
        joinDate: "January 2024",
        avatar: "/images/avatar.jpg",
    };

    return (
        <motion.div
            className="w-full rounded-2xl p-8 space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                        Profile
                    </h2>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                        Manage your personal information and account details
                    </p>
                </div>
                <Button
                    onClick={() => setIsEditing(!isEditing)}
                    className="!p-6 rounded-full bg-foreground hover:bg-foreground/90 text-background text-sm">
                    {isEditing ? (
                        <XIcon className="w-3 h-3 mr-2" />
                    ) : (
                        <PencilIcon className="w-3 h-3 mr-2" />
                    )}
                    {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar Section */}
                <div className="lg:col-span-1">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                                {userInfo.name.charAt(0)}
                            </div>
                            {isEditing && (
                                <Button
                                    size="sm"
                                    className="absolute -bottom-1 -right-1 rounded-full w-5 h-5 p-0">
                                    <PencilIcon className="w-2 h-2" />
                                </Button>
                            )}
                        </div>
                        <div className="text-center">
                            <h3 className="text-base font-semibold">
                                {userInfo.name}
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                Member since {userInfo.joinDate}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label
                                htmlFor="name"
                                className="text-sm font-semibold mb-1 block">
                                Full Name
                            </Label>
                            <p className="text-xs text-muted-foreground mb-2">
                                Your display name as it appears to others
                            </p>
                            <Input
                                id="name"
                                value={userInfo.name}
                                disabled={!isEditing}
                                className="text-sm h-9 !p-6"
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="username"
                                className="text-sm font-semibold mb-1 block">
                                Username
                            </Label>
                            <p className="text-xs text-muted-foreground mb-2">
                                Your unique identifier for login
                            </p>
                            <Input
                                id="username"
                                value={userInfo.username}
                                disabled={!isEditing}
                                className="text-sm h-9 !p-6"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label
                                htmlFor="email"
                                className="text-sm font-semibold mb-1 block">
                                Email Address
                            </Label>
                            <p className="text-xs text-muted-foreground mb-2">
                                Used for account notifications and login
                            </p>
                            <Input
                                id="email"
                                type="email"
                                value={userInfo.email}
                                disabled={!isEditing}
                                className="text-sm h-9 !p-6"
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="phone"
                                className="text-sm font-semibold mb-1 block">
                                Phone Number
                            </Label>
                            <p className="text-xs text-muted-foreground mb-2">
                                For delivery updates and account security
                            </p>
                            <Input
                                id="phone"
                                value={userInfo.phone}
                                disabled={!isEditing}
                                className="text-sm h-9 !p-6"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex gap-3 pt-3">
                            <Button className="!p-6 rounded-full bg-foreground hover:bg-foreground/90 text-background text-sm">
                                <CheckIcon className="w-3 h-3 mr-2" />
                                Save Changes
                            </Button>
                            <Button
                                onClick={() => setIsEditing(!isEditing)}
                                variant="outline"
                                className="!p-6 rounded-full hover:bg-destructive hover:text-background text-sm">
                                <XIcon className="w-3 h-3 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                        Account Actions
                    </h2>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                        Manage your account security and settings
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <Button
                    className="w-full text-sm h-12 rounded-full hover:bg-foreground hover:text-background"
                    variant="outline">
                    <SignOutIcon className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
                <Button className="w-full text-sm h-12 rounded-full bg-foreground hover:bg-destructive">
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete Account
                </Button>
            </div>
        </motion.div>
    );
}

// Address Book Section Component
function AddressBookSection() {
    const addresses = [
        {
            id: 1,
            name: "Home",
            address: "123 Main St, Apt 4B",
            city: "New York",
            state: "NY",
            zip: "10001",
            isDefault: true,
        },
        {
            id: 2,
            name: "Work",
            address: "456 Business Ave, Suite 200",
            city: "New York",
            state: "NY",
            zip: "10002",
            isDefault: false,
        },
    ];

    return (
        <motion.div
            className="w-full rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                        Address Book
                    </h2>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                        Manage your delivery addresses and preferences
                    </p>
                </div>
                <Button
                    className="!p-6 rounded-full bg-foreground hover:bg-foreground/90 text-background text-sm">
                    <PlusIcon className="w-3 h-3 mr-2" />
                    Add Address
                </Button>
            </div>

            <div className="space-y-4">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className="w-full rounded-2xl p-4 border border-border/50">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-base font-semibold">
                                        {address.name}
                                    </span>
                                    {address.isDefault && (
                                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                                            Default
                                        </span>
                                    )}
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {address.address}
                                    <br />
                                    {address.city}, {address.state}{" "}
                                    {address.zip}
                                </p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="p-4.5">
                                    <PencilIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="p-4.5">
                                    <XIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// Order History Section Component
function OrderHistorySection() {
    const orders = [
        {
            id: "ORD-001",
            date: "2024-01-15",
            items: ["Cappuccino", "Croissant"],
            total: 12.5,
            status: "Delivered",
        },
        {
            id: "ORD-002",
            date: "2024-01-10",
            items: ["Latte", "Muffin", "Orange Juice"],
            total: 18.75,
            status: "Delivered",
        },
        {
            id: "ORD-003",
            date: "2024-01-05",
            items: ["Americano", "Bagel"],
            total: 9.25,
            status: "Delivered",
        },
    ];

    return (
        <motion.div
            className="w-full rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                        Order History
                    </h2>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                        View your past orders and track deliveries
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="w-full rounded-2xl p-4 border border-border/50">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-base font-semibold">
                                        {order.id}
                                    </span>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm mb-1">
                                    {order.items.join(", ")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(order.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right w-full sm:w-min">
                                <p className="text-lg font-bold text-foreground">
                                    ${order.total}
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 rounded-full shadow-none hover:bg-foreground hover:text-background text-sm px-4 py-1">
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// Payment Methods Section Component
function PaymentMethodsSection() {

    const paymentMethods = [
        {
            id: 1,
            type: "Visa",
            last4: "4242",
            expiry: "12/25",
            isDefault: true,
        },
        {
            id: 2,
            type: "Mastercard",
            last4: "8888",
            expiry: "08/26",
            isDefault: false,
        },
    ];

    return (
        <motion.div
            className="w-full rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                        Payment Methods
                    </h2>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                        Manage your saved payment methods and billing info
                    </p>
                </div>
                <Button
                    className="!p-6 rounded-full bg-foreground hover:bg-foreground/90 text-background text-sm">
                    <PlusIcon className="w-3 h-3 mr-2" />
                    Add Payment Method
                </Button>
            </div>

            <div className="space-y-4">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className="w-full rounded-2xl p-4 border border-border/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">
                                        {method.type.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-base font-semibold">
                                        {method.type} •••• {method.last4}
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Expires {method.expiry}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {method.isDefault && (
                                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                                        Default
                                    </span>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="p-2">
                                    <PencilIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="p-2">
                                    <XIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// Preferences Section Component
function PreferencesSection() {
    const preferences = {
        notifications: {
            promos: true,
            updates: false,
            orderStatus: true,
        },
        defaultAddressId: 1,
        preferredDrinks: ["Cappuccino", "Latte", "Americano"],
    };

    return (
        <motion.div
            className="w-full rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                        Preferences
                    </h2>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                        Customize your app experience and notifications
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        Notifications
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-2xl border border-border/50">
                            <span className="text-sm">Promotional emails</span>
                            <Checkbox
                                checked={preferences.notifications.promos}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-2xl border border-border/50">
                            <span className="text-sm">Order updates</span>
                            <Checkbox
                                checked={preferences.notifications.orderStatus}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-2xl border border-border/50">
                            <span className="text-sm">App updates</span>
                            <Checkbox
                                checked={preferences.notifications.updates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Account Actions Section Component
function AccountActionsSection() {
    return (
        <motion.div
            className="w-full rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}></motion.div>
    );
}

export default function Account() {
    const [checking, setChecking] = useState(true);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        checkUser("return").then((isLoggedIn) => {
            if (!isLoggedIn) {
                navigate("/login");
            } else {
                setChecking(false);
            }
        });
    }, []);

    // Get active section from search params
    const activeSection = searchParams.get("section") || "basic";

    const sections = [
        {
            id: "basic",
            name: "Basic Info",
            icon: UserIcon,
            component: ProfileSection,
        },
        {
            id: "address",
            name: "Address Book",
            icon: MapPinIcon,
            component: AddressBookSection,
        },
        {
            id: "orders",
            name: "Order History",
            icon: PackageIcon,
            component: OrderHistorySection,
        },
        {
            id: "payment",
            name: "Payment Methods",
            icon: CreditCardIcon,
            component: PaymentMethodsSection,
        },
        {
            id: "preferences",
            name: "Preferences",
            icon: BellIcon,
            component: PreferencesSection,
        },
        {
            id: "actions",
            name: "Account Actions",
            icon: CoffeeIcon,
            component: AccountActionsSection,
        },
    ];

    const ActiveComponent =
        sections.find((s) => s.id === activeSection)?.component ||
        ProfileSection;

    if (checking) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Account Header */}
            <Header variant="account" />

            <div className="sm:px-4 px-0">
                <div className="px-4 sm:px-8 xl:px-32">
                    {/* Main Content Area */}
                    <ActiveComponent />
                </div>
            </div>
        </div>
    );
}
