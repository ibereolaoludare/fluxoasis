import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";
import { supabase } from "@/supabase";
import type { Tables } from "@/supabase.type";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
    ArrowLeftIcon,
    ShoppingCartIcon,
    PlusIcon,
    MinusIcon,
} from "@phosphor-icons/react";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function ItemPage() {
    // Get the id from the URL
    const [location, setLocation] = useLocation();
    const id = Number(location.split("/item/")[1]?.split("/")[0]);

    const [item, setItem] = useState<Tables<"products"> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const addBtnRef = useRef(null);

    useEffect(() => {
        if (!id) {
            setError("Invalid item ID.");
            setLoading(false);
            return;
        }
        (async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();
            if (error || !data) {
                setError("Item not found.");
                setItem(null);
            } else {
                setItem(data);
                setError(null);
            }
            setLoading(false);
        })();
    }, [id]);

    const addToCart = () => {
        if (!item) return;

        // Get existing cart items from localStorage
        const existingCartItems = JSON.parse(
            localStorage.getItem("cart-items") || "[]"
        );

        // Prevent adding the same item more than once
        if (
            existingCartItems.some(
                (cartItem: { id: number }) => cartItem.id === item.id
            )
        ) {
            toast.error("Item is already in the cart!");
            return;
        }

        // Create new cart item
        const newCartItem = {
            id: item.id,
            quantity: quantity,
        };

        // Add to cart array
        const updatedCartItems = [...existingCartItems, newCartItem];

        // Save back to localStorage
        localStorage.setItem("cart-items", JSON.stringify(updatedCartItems));

        // Dispatch custom event to notify header of cart update
        window.dispatchEvent(
            new CustomEvent("cartUpdated", {
                detail: { cartItems: updatedCartItems },
            })
        );

        toast.success("Added to cart!");
    };

    return (
        <div className="min-h-screen bg-background">
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
                        {loading ? (
                            <div className="text-center text-muted-foreground py-16">
                                Loading item details...
                            </div>
                        ) : error ? (
                            <div className="text-center text-destructive py-16">
                                {error}
                            </div>
                        ) : item ? (
                            <div className="flex flex-col md:flex-row gap-10 items-center md:items-stretch">
                                <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center">
                                    <div className="h-60 sm:h-96 w-full bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center overflow-hidden relative">
                                        {/* Image loading skeleton */}
                                        <AnimatePresence>
                                            {!imageLoaded && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-muted animate-pulse rounded-2xl"
                                                />
                                            )}
                                        </AnimatePresence>
                                        <img
                                            src={
                                                (item as any).image ||
                                                `${
                                                    import.meta.env
                                                        .VITE_SUPABASE_URL
                                                }/storage/v1/object/public/products/images/${
                                                    item.id
                                                }.jpg`
                                            }
                                            alt={item.name}
                                            className="w-full h-full object-cover rounded-2xl transition-transform duration-200 hover:scale-105"
                                            onLoad={() => setImageLoaded(true)}
                                            style={{
                                                visibility: imageLoaded
                                                    ? "visible"
                                                    : "hidden",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 w-full md:w-1/2 flex flex-col space-y-4">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 flex flex-col space-y-2 w-full">
                                            <div className="space-x-4">
                                                <span className="text-xs uppercase tracking-wider font-medium text-muted-foreground px-2 py-1 rounded-full bg-muted">
                                                    {item.category}
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
                                            <h2 className="text-2xl font-bold text-foreground mb-1">
                                                {item.name}
                                            </h2>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-base font-semibold">
                                                    {formatPrice(item.price)}
                                                </span>
                                            </div>
                                            {/* Quantity Section */}
                                            <div className="flex flex-col gap-4">
                                                <h5 className="font-medium text-xs uppercase">
                                                    Quantity
                                                </h5>
                                                <div className="flex w-min items-center gap-4 rounded-full p-1.5 bg-muted text-xs">
                                                    <Button
                                                        variant="ghost"
                                                        className="hover:bg-foreground hover:text-background cursor-pointer rounded-full w-8 h-8 text-xs focus:ring-2 focus:ring-primary"
                                                        onClick={() =>
                                                            setQuantity((q) =>
                                                                Math.max(
                                                                    1,
                                                                    q - 1
                                                                )
                                                            )
                                                        }
                                                        aria-label="Decrease quantity"
                                                        disabled={
                                                            quantity <= 1 ||
                                                            !item.inStock
                                                        }>
                                                        <MinusIcon weight="bold" />
                                                    </Button>
                                                    <motion.span
                                                        className="font-semibold min-w-[2ch] text-center"
                                                        key={quantity}
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
                                                        {quantity}
                                                    </motion.span>
                                                    <Button
                                                        variant="ghost"
                                                        className="hover:bg-foreground hover:text-background cursor-pointer rounded-full text-sm w-8 h-8 focus:ring-2 focus:ring-primary"
                                                        onClick={() =>
                                                            setQuantity(
                                                                (q) => q + 1
                                                            )
                                                        }
                                                        aria-label="Increase quantity"
                                                        disabled={
                                                            !item.inStock
                                                        }>
                                                        <PlusIcon weight="bold" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <motion.div
                                                whileTap={{ scale: 0.97 }}
                                                className="mt-4">
                                                <Button
                                                    ref={addBtnRef}
                                                    className="!p-6.5 rounded-full bg-foreground hover:bg-foreground/90 text-background text-sm w-full md:w-auto transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary"
                                                    disabled={!item.inStock}
                                                    aria-disabled={
                                                        !item.inStock
                                                    }
                                                    aria-label="Add to Cart"
                                                    onClick={addToCart}>
                                                    <ShoppingCartIcon className="w-4 h-4 mr-2" />
                                                    Add to Cart
                                                </Button>
                                            </motion.div>
                                            {!item.inStock && (
                                                <div className="text-xs text-destructive mt-2">
                                                    This item is currently out
                                                    of stock.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
