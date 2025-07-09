import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    MagnifyingGlassIcon,
    GridFourIcon,
    ListIcon,
} from "@phosphor-icons/react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import ProductCard from "@/components/ui/product-card";
import SEO from "@/components/SEO";
import { supabase } from "@/supabase";
import type { Tables } from "@/supabase.type";

export default function Shop() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("featured");
    const [products, setProducts] = useState<Tables<"products">[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from Supabase
    useEffect(() => {
        (async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("id", { ascending: true });
            if (!error && data) setProducts(data);
            setLoading(false);
        })();
    }, []);

    const categories = [
        { id: "All", name: "All Products", count: 120 },
        { id: "Soft Drinks", name: "Soft Drinks", count: 45 },
        { id: "Energy", name: "Energy Drinks", count: 25 },
        { id: "Juice", name: "Juice", count: 30 },
        { id: "Water", name: "Water", count: 15 },
        { id: "Mixes", name: "Mixes", count: 5 },
    ];

    // Filter products based on search and category
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            case "rating":
                return (b.ratings || 0) - (a.ratings || 0);
            case "name":
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    return (
        <>
            <SEO
                title="Shop All Drinks | Fluxoasis - Premium Beverages"
                description="Browse our complete collection of premium beverages including soft drinks, energy drinks, juices, and water. Fast delivery and excellent customer service."
                keywords="shop drinks, buy beverages, soft drinks, energy drinks, juices, water, online drinks store, Nigeria"
                url="/shop"
                type="website"
            />
            <Header />
            <main className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="pb-8 px-4 sm:px-8 lg:px-16 xl:px-32">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="text-center mb-6 py-8"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                                Shop All Drinks
                            </h1>
                            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                                Discover our complete collection of refreshing
                                beverages
                            </p>
                        </motion.div>

                        {/* Search and Filters */}
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}>
                            {/* Search Bar */}
                            <div className="relative max-w-2xl border-4 p-6 py-0 mx-auto flex items-center rounded-full">
                                <MagnifyingGlassIcon className="w-8 h-8 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search for drinks..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="p-4 bg-background shadow-none border-0 transition-colors duration-200 focus-visible:ring-0"
                                />
                            </div>

                            {/* Category Filters */}
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                {categories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={
                                            selectedCategory === category.id
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            setSelectedCategory(category.id)
                                        }
                                        className="rounded-full shadow-none px-4 py-2 text-sm transition-all duration-200">
                                        {category.name}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Products Section */}
                <section className="px-4 sm:px-8 lg:px-16 xl:px-32 pb-16">
                    <div className="max-w-7xl mx-auto">
                        {/* Results Header */}
                        <motion.div
                            className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}>
                            <div className="flex items-center gap-4">
                                <p className="text-muted-foreground">
                                    Showing {sortedProducts.length} of{" "}
                                    {products.length} products
                                </p>
                                {selectedCategory !== "All" && (
                                    <Badge
                                        variant="outline"
                                        className="text-sm">
                                        {selectedCategory}
                                    </Badge>
                                )}
                            </div>

                            {/* View and Sort Controls */}
                            <div className="flex items-center gap-3">
                                {/* Sort Dropdown */}
                                <Select
                                    value={sortBy}
                                    onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="featured">
                                            Featured
                                        </SelectItem>
                                        <SelectItem value="price-low">
                                            Price: Low to High
                                        </SelectItem>
                                        <SelectItem value="price-high">
                                            Price: High to Low
                                        </SelectItem>
                                        <SelectItem value="rating">
                                            Highest Rated
                                        </SelectItem>
                                        <SelectItem value="name">
                                            Name: A-Z
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* View Mode Toggle */}
                                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                                    <Button
                                        variant={
                                            viewMode === "grid"
                                                ? "default"
                                                : "ghost"
                                        }
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className="w-8 h-8 p-0">
                                        <GridFourIcon className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={
                                            viewMode === "list"
                                                ? "default"
                                                : "ghost"
                                        }
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className="w-8 h-8 p-0">
                                        <ListIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Products Grid */}
                        <motion.div
                            className={`grid gap-6 ${
                                viewMode === "grid"
                                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                    : "grid-cols-1"
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}>
                            {loading ? (
                                <div className="text-center text-muted-foreground py-16 col-span-full">
                                    Loading products...
                                </div>
                            ) : sortedProducts.length === 0 ? (
                                <motion.div
                                    className="text-center py-16 col-span-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6 }}>
                                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                                        <MagnifyingGlassIcon className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        No products found
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Try adjusting your search or filter
                                        criteria
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategory("All");
                                        }}
                                        variant="outline">
                                        Clear Filters
                                    </Button>
                                </motion.div>
                            ) : (
                                sortedProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.8 + index * 0.1,
                                        }}>
                                        <ProductCard
                                            id={product.id}
                                            name={product.name}
                                            category={product.category}
                                            price={product.price}
                                            image={
                                                (product as any).image ||
                                                `${
                                                    import.meta.env
                                                        .VITE_SUPABASE_URL
                                                }/storage/v1/object/public/products/images/${
                                                    product.id
                                                }.jpg`
                                            }
                                        />
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
