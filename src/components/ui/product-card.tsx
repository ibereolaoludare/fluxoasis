import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "wouter";

interface ProductCardProps {
    id: number;
    name: string;
    category: string;
    price: number;
    image?: string;
}

export default function ProductCard({
    id,
    name,
    category,
    price,
    image,
}: ProductCardProps) {
    // Construct image URL using Supabase URL
    const imageUrl =
        image ||
        `${
            import.meta.env.VITE_SUPABASE_URL
        }/storage/v1/object/public/products/images/${id}.jpg`;

    return (
        <div
            className="relative bg-background rounded-4xl overflow-hidden border border-border/50 transition-all duration-200"
            id={id.toString()}>
            {/* Product Image Container */}
            <div className="relative h-48 p-4 sm:h-56 overflow-hidden flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover bg-muted rounded-3xl transition-transform duration-300"
                />
            </div>
            {/* Product Content */}
            <div className="p-5 py-2 flex flex-col">
                <div>
                    <span className="uppercase text-xs text-muted-foreground tracking-wide">
                        {category}
                    </span>
                    <h3 className="font-bold text-lg text-foreground transition-colors duration-200">
                        {name}
                    </h3>
                </div>
                <div className="flex flex-col gap-4 justify-between">
                    <span>₦{price.toFixed(2)}</span>
                    <Link
                        to={"/item/" + id}
                        asChild>
                        <Button className="!p-6 w-full rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 shadow-none">
                            View Details
                            <ArrowRightIcon />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
