import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowLeftIcon,
    PlusIcon,
    MinusIcon,
    TrashIcon,
    ShoppingCartIcon,
    PackageIcon,
} from "@phosphor-icons/react";
import { useLocation } from "wouter";
import Header from "@/components/ui/header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/supabase";
import { toast } from "sonner";
import { cn, formatPrice, payWithPayStack } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

// Cart item interface matching localStorage structure
interface CartItem {
    id: number;
    quantity: number;
}

// Extended cart item with product details
interface CartItemWithDetails extends CartItem {
    name: string;
    price: number;
    image: string;
    category: string;
    inStock: boolean;
}

export default function Cart() {
    const [, setLocation] = useLocation();
    const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
    const [checkoutForm, setCheckoutForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    // Load cart items from localStorage and fetch product details
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                setLoading(true);

                // Get cart items from localStorage
                const cartItemsData: CartItem[] = JSON.parse(
                    localStorage.getItem("cart-items") || "[]"
                );

                if (cartItemsData.length === 0) {
                    setCartItems([]);
                    setLoading(false);
                    return;
                }

                // Fetch product details for all cart items
                const productIds = cartItemsData.map((item) => item.id);
                const { data: products, error } = await supabase
                    .from("products")
                    .select("*")
                    .in("id", productIds);

                if (error) {
                    console.error("Error fetching products:", error);
                    toast.error("Failed to load cart items");
                    setLoading(false);
                    return;
                }

                // Combine cart data with product details
                const itemsWithDetails: CartItemWithDetails[] = cartItemsData
                    .map((cartItem) => {
                        const product = products.find(
                            (p) => p.id === cartItem.id
                        );
                        if (!product) {
                            return null;
                        }

                        return {
                            ...cartItem,
                            name: product.name,
                            price: product.price,
                            image:
                                product.image ||
                                `${
                                    import.meta.env.VITE_SUPABASE_URL
                                }/storage/v1/object/public/products/images/${
                                    product.id
                                }.jpg`,
                            category: product.category,
                            inStock: product.inStock,
                        };
                    })
                    .filter(Boolean) as CartItemWithDetails[];

                setCartItems(itemsWithDetails);
            } catch (error) {
                console.error("Error loading cart:", error);
                toast.error("Failed to load cart");
            } finally {
                setLoading(false);
            }
        };

        loadCartItems();
    }, []);

    const updateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        const updatedItems = cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );

        setCartItems(updatedItems);

        // Update localStorage
        const cartData = updatedItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
        }));
        localStorage.setItem("cart-items", JSON.stringify(cartData));
    };

    const removeItem = (itemId: number) => {
        const updatedItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedItems);

        // Update localStorage
        const cartData = updatedItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
        }));
        localStorage.setItem("cart-items", JSON.stringify(cartData));

        toast.success("Item removed from cart");
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart-items");
        toast.success("Cart cleared");
    };

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            // Get current user
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();
            if (userError || !user) {
                toast.error("You must be logged in to place an order.");
                setCheckoutLoading(false);
                return;
            }

            // Get user profile data for payment
            const { data: profile } = await supabase.auth.getUser();
            const userEmail = profile.user?.email || "";
            const userName = profile.user?.user_metadata?.name || "";
            const userPhone = profile.user?.user_metadata?.phone || "";

            // Check if we have all required user data
            if (!userEmail || !userName || !userPhone) {
                // Show checkout dialog to collect missing information
                setCheckoutForm({
                    firstName: userName.split(" ")[0] || "",
                    lastName: userName.split(" ").slice(1).join(" ") || "",
                    email: userEmail || "",
                    phone: userPhone || "",
                });
                setShowCheckoutDialog(true);
                setCheckoutLoading(false);
                return;
            }

            // All data available, proceed with payment
            await processPayment(userEmail, userName, userPhone);
        } catch (err) {
            toast.error("An unexpected error occurred.");
            console.error("Checkout error:", err);
            setCheckoutLoading(false);
        }
    };

    const processPayment = async (
        email: string,
        name: string,
        phone: string
    ) => {
        try {
            // Split name into first and last name
            const nameParts = name.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            // Process payment through Paystack
            const paymentResult = await payWithPayStack(
                total,
                {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    tel: phone,
                },
                (reference) => {
                    console.log("Payment successful:", reference);
                },
                (error) => {
                    console.error("Payment failed:", error);
                    toast.error(`Payment failed: ${error}`);
                }
            );

            if (!paymentResult.success) {
                toast.error(`Payment failed: ${paymentResult.error}`);
                setCheckoutLoading(false);
                return;
            }

            // Payment successful, create order
            const orderData = {
                items: cartItems.map(
                    ({ id, name, price, quantity, image, category }) => ({
                        id,
                        name,
                        price,
                        quantity,
                        image,
                        category,
                    })
                ),
                total,
                created_at: new Date().toISOString(),
                payment_reference: paymentResult.reference,
            };

            // Get current user
            const {
                data: { user },
            } = await supabase.auth.getUser();

            // Insert into orders table
            const { error: insertError } = await supabase
                .from("orders")
                .insert([
                    {
                        user_id: user!.id,
                        order: orderData,
                        order_state: "processing", // Changed from "pending" to "processing" since payment is successful
                    },
                ]);

            if (insertError) {
                toast.error("Failed to place order. Please try again.");
                console.error("Error: ", insertError.message);
                setCheckoutLoading(false);
                return;
            }

            toast.success("Order placed successfully! Payment completed.");
            setCartItems([]);
            localStorage.removeItem("cart-items");
            setShowCheckoutDialog(false);
        } catch (err) {
            toast.error("An unexpected error occurred.");
            console.error("Payment error:", err);
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleCheckoutFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (
            !checkoutForm.firstName ||
            !checkoutForm.lastName ||
            !checkoutForm.email ||
            !checkoutForm.phone
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }

        // Update user profile with the provided information
        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                name: `${checkoutForm.firstName} ${checkoutForm.lastName}`,
                phone: checkoutForm.phone,
            },
        });

        if (updateError) {
            console.error("Error updating profile:", updateError);
        }

        // Process payment with the form data
        await processPayment(
            checkoutForm.email,
            `${checkoutForm.firstName} ${checkoutForm.lastName}`,
            checkoutForm.phone
        );
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Calculate Paystack charges
    const calculatePaystackCharges = (amount: number) => {
        if (amount < 2500) {
            // For transactions under ₦2,500, only 1.5% fee (₦100 is waived)
            return Math.min(amount * 0.015, 2000);
        } else {
            // For transactions ₦2,500 and above: 1.5% + ₦100, capped at ₦2,000
            const percentageFee = amount * 0.015;
            const flatFee = 100;
            return Math.min(percentageFee + flatFee, 2000);
        }
    };

    const paystackCharges = calculatePaystackCharges(subtotal);
    const total = subtotal + paystackCharges;
    const itemCount = cartItems.length;

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <SEO
                    title="Shopping Cart - FluxOasis"
                    description="Review your items and complete your purchase in our secure shopping cart. Fast checkout with Paystack payment processing."
                    keywords="shopping cart, checkout, online shopping, beverages, drinks, payment, order summary, FluxOasis"
                    url="/cart"
                />
                <div className="sm:px-4 px-0">
                    <div className="px-4 sm:px-8 xl:px-32">
                        <motion.div
                            className="w-full pb-16 rounded-2xl px-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}>
                            <Button
                                variant="ghost"
                                className="mb-6 flex items-center gap-2 hover:bg-muted/40 focus:ring-2 focus:ring-primary"
                                onClick={() => setLocation("/shop")}
                                aria-label="Back to Shop">
                                <ArrowLeftIcon
                                    className="w-8 h-8"
                                    weight="bold"
                                />
                                Back to Shop
                            </Button>

                            <div className="text-center text-muted-foreground py-16">
                                Loading cart...
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Shopping Cart | FluxOasis - Premium Beverages"
                description="Review your items and complete your purchase in our secure shopping cart. Fast checkout with Paystack payment processing."
                keywords="shopping cart, checkout, online shopping, beverages, drinks, payment, order summary, FluxOasis"
                url="/cart"
            />
            <Header />
            <div className="sm:px-4 px-0">
                <div className="px-4 sm:px-8 xl:px-32">
                    <motion.div
                        className="w-full pb-16 rounded-2xl px-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}>
                        <Button
                            variant="ghost"
                            className="mb-6 flex items-center gap-2 hover:bg-muted/40 focus:ring-2 focus:ring-primary"
                            onClick={() => setLocation("/shop")}
                            aria-label="Back to Shop">
                            <ArrowLeftIcon
                                className="w-8 h-8"
                                weight="bold"
                            />
                            Back to Shop
                        </Button>

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Cart Items Section */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-2xl font-bold text-foreground">
                                        Shopping Cart ({itemCount} items)
                                    </h1>
                                    {cartItems.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={clearCart}>
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Clear Cart
                                        </Button>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {cartItems.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-16">
                                            <PackageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                                Your cart is empty
                                            </h3>
                                            <p className="text-muted-foreground mb-6">
                                                Add some items to get started
                                            </p>
                                            <Button
                                                onClick={() =>
                                                    setLocation("/shop")
                                                }
                                                className="rounded-full bg-foreground hover:bg-foreground/90 text-background">
                                                Continue Shopping
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cartItems.map((item, index) => (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    transition={{
                                                        delay: index * 0.1,
                                                    }}
                                                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                                                    {/* Item Image */}
                                                    <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-xl overflow-hidden">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Item Details */}
                                                    <div className="flex-1 flex flex-col sm:flex-row gap-4">
                                                        <div className="flex-1">
                                                            <div className="space-x-2 mb-2">
                                                                <span className="text-xs uppercase tracking-wider font-medium text-muted-foreground px-2 py-1 rounded-full bg-muted">
                                                                    {
                                                                        item.category
                                                                    }
                                                                </span>
                                                                <span
                                                                    className={cn(
                                                                        "text-xs uppercase tracking-wider font-medium px-2 py-1 rounded-full bg-muted",
                                                                        item.inStock
                                                                            ? "text-secondary"
                                                                            : "text-destructive"
                                                                    )}>
                                                                    {item.inStock
                                                                        ? "In Stock"
                                                                        : "Out of Stock"}
                                                                </span>
                                                            </div>
                                                            <h3 className="font-semibold text-foreground mb-1">
                                                                {item.name}
                                                            </h3>
                                                            <p className="text-lg font-bold text-foreground">
                                                                {formatPrice(
                                                                    item.price
                                                                )}
                                                            </p>
                                                        </div>

                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-2 rounded-full p-2 bg-muted">
                                                                <Button
                                                                    variant="ghost"
                                                                    className="hover:bg-foreground hover:text-background cursor-pointer rounded-full w-8 h-8 text-xs focus:ring-2 focus:ring-primary"
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.id,
                                                                            item.quantity -
                                                                                1
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        item.quantity <=
                                                                            1 ||
                                                                        !item.inStock
                                                                    }
                                                                    aria-label="Decrease quantity">
                                                                    <MinusIcon weight="bold" />
                                                                </Button>
                                                                <motion.span
                                                                    className="font-semibold min-w-[2ch] text-center"
                                                                    key={
                                                                        item.quantity
                                                                    }
                                                                    initial={{
                                                                        scale: 0.8,
                                                                        opacity: 0,
                                                                    }}
                                                                    animate={{
                                                                        scale: 1,
                                                                        opacity: 1,
                                                                    }}
                                                                    transition={{
                                                                        type: "spring",
                                                                        stiffness: 300,
                                                                        damping: 20,
                                                                    }}>
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </motion.span>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="hover:bg-foreground hover:text-background cursor-pointer rounded-full text-sm w-8 h-8 focus:ring-2 focus:ring-primary"
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.id,
                                                                            item.quantity +
                                                                                1
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !item.inStock
                                                                    }
                                                                    aria-label="Increase quantity">
                                                                    <PlusIcon weight="bold" />
                                                                </Button>
                                                            </div>

                                                            {/* Remove Button */}
                                                            <Button
                                                                variant="ghost"
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full w-8 h-8"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        item.id
                                                                    )
                                                                }
                                                                aria-label="Remove item">
                                                                <TrashIcon weight="bold" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Order Summary */}
                            {cartItems.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="lg:w-80">
                                    <div className="sticky top-8">
                                        <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
                                            <h2 className="text-xl font-bold text-foreground mb-4">
                                                Order Summary
                                            </h2>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Subtotal ({itemCount}{" "}
                                                        items)
                                                    </span>
                                                    <span className="font-semibold">
                                                        {formatPrice(subtotal)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Payment Charges
                                                    </span>
                                                    <span className="font-semibold">
                                                        {formatPrice(
                                                            paystackCharges
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="border-t border-border/50 pt-3">
                                                    <div className="flex justify-between text-lg font-bold">
                                                        <span>Total</span>
                                                        <span>
                                                            {formatPrice(total)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <motion.div
                                                whileTap={{ scale: 0.97 }}>
                                                <Button
                                                    className="w-full !p-6 rounded-full bg-foreground hover:bg-foreground/90 text-background text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary"
                                                    disabled={
                                                        checkoutLoading ||
                                                        cartItems.some(
                                                            (item) =>
                                                                !item.inStock
                                                        )
                                                    }
                                                    onClick={handleCheckout}>
                                                    {checkoutLoading ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                                            Processing...
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <ShoppingCartIcon className="w-4 h-4 mr-2" />
                                                            Proceed to Checkout
                                                        </>
                                                    )}
                                                </Button>
                                            </motion.div>

                                            {cartItems.some(
                                                (item) => !item.inStock
                                            ) && (
                                                <div className="text-xs text-destructive mt-3 text-center">
                                                    Some items are out of stock
                                                    and cannot be purchased.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <Dialog
                open={showCheckoutDialog}
                onOpenChange={setShowCheckoutDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Complete Your Order</DialogTitle>
                        <DialogDescription>
                            Please provide your details to complete the payment.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCheckoutFormSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="firstName"
                                    className="text-right">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    value={checkoutForm.firstName}
                                    onChange={(e) =>
                                        setCheckoutForm({
                                            ...checkoutForm,
                                            firstName: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="lastName"
                                    className="text-right">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    value={checkoutForm.lastName}
                                    onChange={(e) =>
                                        setCheckoutForm({
                                            ...checkoutForm,
                                            lastName: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="email"
                                    className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={checkoutForm.email}
                                    onChange={(e) =>
                                        setCheckoutForm({
                                            ...checkoutForm,
                                            email: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="phone"
                                    className="text-right">
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    value={checkoutForm.phone}
                                    onChange={(e) =>
                                        setCheckoutForm({
                                            ...checkoutForm,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-full">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={checkoutLoading}
                                className="rounded-full">
                                {checkoutLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                        Processing Payment...
                                    </div>
                                ) : (
                                    "Proceed to Payment"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
