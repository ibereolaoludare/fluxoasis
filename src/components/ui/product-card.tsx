import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@phosphor-icons/react";

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    image: string;
}

export default function ProductCard({
    id,
    name,
    price,
    image,
}: ProductCardProps) {
    return (
        <div
            className="relative bg-background rounded-4xl overflow-hidden border border-border/50 transition-all duration-200"
            id={id.toString()}>
            {/* Product Image Container */}
            <div className="relative h-48 p-4 sm:h-56 overflow-hidden lex items-center justify-center">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover bg-muted rounded-3xl transition-transform duration-300"
                />
            </div>
            {/* Product Content */}
            <div className="p-5 py-2 flex flex-col">
                <h3 className="font-bold text-foreground text-xl transition-colors duration-200 line-clamp-2">
                    {name}
                </h3>
                <div className="flex flex-col gap-4 justify-between">
                    <span className="font-light tracking-wide text-base">
                        ₦ {price.toFixed(2)}
                    </span>
                    <Button
                        onClick={() => {
                            // Add to cart functionality
                            console.log(`Added ${name} to cart`);
                        }}
                        className="bg-foreground !p-6 w-full hover:bg-foreground/90 text-primary-foreground rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 shadow-none">
                        Buy Now
                        <ArrowRightIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
}
