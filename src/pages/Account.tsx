import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
    UserIcon,
    CreditCardIcon,
    SignOutIcon,
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
import { checkUser, supabase, logOut } from "@/supabase";
import { navigate } from "wouter/use-browser-location";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from "@/components/ui/dialog";
import { Link } from "wouter";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

// Add Address type
interface Address {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    isDefault: boolean;
}

// Profile Section Component
function ProfileSection() {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        joinDate: "",
    });
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    });
    const [role, setRole] = useState<string>("user");

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (user) {
                    const userMetadata = user.user_metadata || {};
                    const createdAt = new Date(user.created_at);

                    setUserData({
                        name:
                            userMetadata.name ||
                            user.email?.split("@")[0] ||
                            "User",
                        email: user.email || "",
                        phone: userMetadata.phone || "",
                        joinDate: createdAt.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                        }),
                    });

                    setFormData({
                        name:
                            userMetadata.name ||
                            user.email?.split("@")[0] ||
                            "User",
                        phone: userMetadata.phone || "",
                    });
                    setRole(userMetadata.role || "user");
                }
            } catch {
                toast.error("Error: Failed to fetch user data.");
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        setIsLoading(true);
        try {
            const result = await supabase.auth.updateUser({
                data: {
                    name: formData.name,
                    phone: formData.phone,
                },
            });
            if (result.error) {
                toast.error(
                    "Error updating profile: " + result.error.message + "."
                );
            } else {
                setUserData((prev) => ({
                    ...prev,
                    name: formData.name,
                    phone: formData.phone,
                }));
                setIsEditing(false);
                toast.success("Profile updated successfully.");
            }
        } catch {
            toast.error("Error updating profile.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: userData.name,
            phone: userData.phone,
        });
        setIsEditing(false);
    };

    const handleRoleChange = async (newRole: string) => {
        setIsLoading(true);
        try {
            const result = await supabase.auth.updateUser({
                data: {
                    ...formData,
                    role: newRole,
                },
            });
            if (result.error) {
                toast.error(
                    "Error updating role: " + result.error.message + "."
                );
            } else {
                setRole(newRole);
                toast.success(`Role updated to ${newRole}.`);
            }
        } catch {
            toast.error("Error updating role.");
        } finally {
            setIsLoading(false);
        }
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
                <div className="flex gap-2 items-center">
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
                    <Select
                        value={role}
                        onValueChange={handleRoleChange}>
                        <SelectTrigger className="rounded-full text-xs px-4 py-2 w-36">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar Section */}
                <div className="lg:col-span-1">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                                {userData.name.charAt(0)}
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
                                {userData.name}
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                Member since {userData.joinDate}
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
                                name="name"
                                value={
                                    isEditing ? formData.name : userData.name
                                }
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="text-sm h-9 !p-6"
                            />
                        </div>
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
                                value={userData.email}
                                disabled={true}
                                className="text-sm h-9 !p-6"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                name="phone"
                                value={
                                    isEditing ? formData.phone : userData.phone
                                }
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="text-sm h-9 !p-6"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex flex-col sm:flex-row gap-3 pt-3">
                            <Button
                                onClick={handleSaveChanges}
                                disabled={isLoading}
                                className="!p-6 rounded-full bg-foreground hover:bg-foreground/90 text-background text-sm sm:w-auto w-full">
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    <>
                                        <CheckIcon className="w-3 h-3 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="!p-6 rounded-full hover:bg-foreground hover:text-background text-sm sm:w-auto w-full">
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
                    onClick={logOut}
                    className="w-full text-sm !p-6 rounded-full bg-foreground hover:bg-foreground/90 sm:w-min hover:text-background">
                    <SignOutIcon className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        </motion.div>
    );
}

// Address Book Section Component
function AddressBookSection() {
    const [addresses, setAddresses] = useState<Address[]>([] as Address[]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [form, setForm] = useState<Omit<Address, "id">>({
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        isDefault: false,
    });
    const [saving, setSaving] = useState(false);

    // Fetch addresses from user metadata
    useEffect(() => {
        const fetchAddresses = async () => {
            setLoading(true);
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Error: Failed to fetch addresses.");
                setLoading(false);
                return;
            }
            const userAddresses: Address[] =
                user.user_metadata?.addresses || [];
            setAddresses(userAddresses);
            setLoading(false);
        };
        fetchAddresses();
    }, []);

    // Handle form input
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Open dialog for add or edit
    const openDialog = (index: number | null = null) => {
        if (index !== null) {
            setForm({
                name: addresses[index].name,
                address: addresses[index].address,
                city: addresses[index].city,
                state: addresses[index].state,
                zip: addresses[index].zip,
                isDefault: addresses[index].isDefault,
            });
        } else {
            setForm({
                name: "",
                address: "",
                city: "",
                state: "",
                zip: "",
                isDefault: false,
            });
        }
        setEditIndex(index);
        setDialogOpen(true);
    };

    // Save address (add or edit)
    const saveAddress = async () => {
        setSaving(true);
        let newAddresses = [...addresses];
        // If setting as default, unset others
        if (form.isDefault) {
            newAddresses = newAddresses.map((a) => ({
                ...a,
                isDefault: false,
            }));
        }
        if (editIndex !== null) {
            newAddresses[editIndex] = { ...newAddresses[editIndex], ...form };
        } else {
            newAddresses.push({ ...form, id: Date.now() });
        }
        // Ensure only one default
        if (!newAddresses.some((a) => a.isDefault) && newAddresses.length > 0) {
            newAddresses[0].isDefault = true;
        }
        const result = await supabase.auth.updateUser({
            data: { addresses: newAddresses },
        });
        if (result.error) {
            toast.error("Error saving address.");
        } else {
            setAddresses(newAddresses);
            setDialogOpen(false);
            toast.success("Address saved.");
        }
        setSaving(false);
    };

    // Delete address
    const deleteAddress = async (index: number) => {
        const newAddresses = addresses.filter((_, i) => i !== index);
        // If default was deleted, set first as default
        if (!newAddresses.some((a) => a.isDefault) && newAddresses.length > 0) {
            newAddresses[0].isDefault = true;
        }
        const { error } = await supabase.auth.updateUser({
            data: { addresses: newAddresses },
        });
        if (error) {
            toast.error("Error deleting address.");
        } else {
            setAddresses(newAddresses);
            toast.success("Address deleted.");
        }
    };

    // Set default address
    const setDefault = async (index: number) => {
        const newAddresses = addresses.map((a, i) => ({
            ...a,
            isDefault: i === index,
        }));
        const { error } = await supabase.auth.updateUser({
            data: { addresses: newAddresses },
        });
        if (error) {
            toast.error("Error setting default address.");
        } else {
            setAddresses(newAddresses);
            toast.success("Default address set.");
        }
    };

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
                    className="!p-6 rounded-full bg-foreground hover:bg-foreground/90 text-background text-sm"
                    onClick={() => openDialog(null)}>
                    <PlusIcon className="w-3 h-3 mr-2" />
                    Add Address
                </Button>
            </div>
            <div className="space-y-4">
                {loading ? (
                    <div className="text-muted-foreground text-sm">
                        Loading...
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="text-muted-foreground text-sm">
                        No addresses yet.
                    </div>
                ) : (
                    addresses.map((address, idx) => (
                        <div
                            key={address.id || idx}
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
                                        className="p-4.5"
                                        onClick={() => openDialog(idx)}>
                                        <PencilIcon className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="p-4.5"
                                        onClick={() => deleteAddress(idx)}>
                                        <XIcon className="w-4 h-4" />
                                    </Button>
                                    {!address.isDefault && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="p-4.5"
                                            onClick={() => setDefault(idx)}>
                                            Set Default
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Dialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editIndex !== null
                                ? "Edit Address"
                                : "Add Address"}
                        </DialogTitle>
                        <DialogDescription>
                            {editIndex !== null
                                ? "Update the details for this address."
                                : "Add a new delivery address to your account. You can set one as your default for faster checkout."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Input
                            name="name"
                            placeholder="Label (e.g. Home, Work)"
                            value={form.name}
                            onChange={handleFormChange}
                        />
                        <Input
                            name="address"
                            placeholder="Street Address"
                            value={form.address}
                            onChange={handleFormChange}
                        />
                        <div className="flex gap-2">
                            <Input
                                name="city"
                                placeholder="City"
                                value={form.city}
                                onChange={handleFormChange}
                            />
                            <Input
                                name="state"
                                placeholder="State"
                                value={form.state}
                                onChange={handleFormChange}
                            />
                            <Input
                                name="zip"
                                placeholder="ZIP"
                                value={form.zip}
                                onChange={handleFormChange}
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <Checkbox
                                name="isDefault"
                                checked={form.isDefault}
                                onCheckedChange={(checked) =>
                                    handleFormChange({
                                        target: {
                                            name: "isDefault",
                                            value: checked,
                                            type: "checkbox",
                                            checked: checked,
                                        },
                                    } as React.ChangeEvent<HTMLInputElement>)
                                }
                            />
                            Set as default address
                        </label>
                    </div>
                    <DialogFooter className="!flex-col">
                        <Button
                            onClick={saveAddress}
                            disabled={saving}
                            className="w-full !p-6 rounded-full bg-foreground hover:bg-foreground/90">
                            {saving ? (
                                <>
                                    <CheckIcon className="w-4 h-4 mr-2" />{" "}
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="w-4 h-4 mr-2" /> Save
                                    Address
                                </>
                            )}
                        </Button>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="w-full hover:bg-foreground hover:text-background !p-6 rounded-full">
                                <XIcon className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
                <Button className="!p-6 rounded-full bg-foreground hover:bg-foreground/90 text-background text-sm">
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
                    <div className="flex justify-end mt-8">
                        <Link
                            to="/admin"
                            className="text-xs text-muted-foreground opacity-40 hover:opacity-70 transition-opacity underline">
                            Admin?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
