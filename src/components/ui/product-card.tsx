import { StarIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    image: string;
    rating: number;
    reviews: number;
}

export default function ProductCard({
    id,
    name,
    price,
    image,
    rating,
    reviews,
}: ProductCardProps) {
    return (
        <div
            className="group relative bg-background rounded-xl overflow-hidden border border-border/20 hover:border-border/40 transition-all duration-300"
            id={id.toString()}>
            {/* Product Image Container */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-muted/20 to-muted/10">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 border border-border/20">
                    <StarIcon
                        weight="fill"
                        className="w-3 h-3 text-yellow-500"
                    />
                    <span className="text-xs font-medium text-foreground">
                        {rating}
                    </span>
                </div>
            </div>

            {/* Product Content */}
            <div className="p-4">
                {/* Product Name */}
                <h3 className="font-semibold text-foreground text-base mb-1 group-hover:text-primary transition-colors duration-200">
                    {name}
                </h3>

                {/* Reviews */}
                <p className="text-xs text-muted-foreground mb-3">
                    {reviews} reviews
                </p>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-primary">
                            ${price}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Free delivery
                        </span>
                    </div>

                    {/* Add to Cart Button */}
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full !p-4 transition-all duration-200">
                        <ShoppingCartIcon className="w-5 h-5 mr-1" />
                        Add
                    </Button>
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    );
}
