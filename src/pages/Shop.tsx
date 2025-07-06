import { useState } from "react";
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

export default function Shop() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("featured");

    const categories = [
        { id: "All", name: "All Products", count: 120 },
        { id: "Soft Drinks", name: "Soft Drinks", count: 45 },
        { id: "Energy", name: "Energy Drinks", count: 25 },
        { id: "Juice", name: "Juice", count: 30 },
        { id: "Water", name: "Water", count: 15 },
        { id: "Mixes", name: "Mixes", count: 5 },
    ];

    const products = [
        {
            id: 1,
            name: "Coca Cola Classic",
            price: 2.99,
            image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: 4.8,
            reviews: 124,
            category: "Soft Drinks",
            inStock: true,
        },
        {
            id: 2,
            name: "Pepsi Max",
            price: 2.49,
            image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: 4.6,
            reviews: 89,
            category: "Soft Drinks",
            inStock: true,
        },
        {
            id: 3,
            name: "Fanta Orange",
            price: 2.79,
            image: "https://plus.unsplash.com/premium_photo-1667543228378-ec4478ab2845?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: 4.7,
            reviews: 156,
            category: "Soft Drinks",
            inStock: true,
        },
        {
            id: 4,
            name: "Sprite Lemon",
            price: 2.59,
            image: "https://images.unsplash.com/photo-1616118132534-381148898bb4?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: 4.5,
            reviews: 67,
            category: "Soft Drinks",
            inStock: true,
        },
        {
            id: 5,
            name: "Red Bull Energy",
            price: 3.99,
            image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: 4.9,
            reviews: 203,
            category: "Energy",
            inStock: true,
        },
        {
            id: 6,
            name: "Monster Energy",
            price: 3.49,
            image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: 4.7,
            reviews: 178,
            category: "Energy",
            inStock: true,
        },
        {
            id: 7,
            name: "Orange Juice",
            price: 4.99,
            image: "https://plus.unsplash.com/premium_photo-1667543228378-ec4478ab2845?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: 4.8,
            reviews: 92,
            category: "Juice",
            inStock: true,
        },
        {
            id: 8,
            name: "Apple Juice",
            price: 4.49,
            image: "https://images.unsplash.com/photo-1616118132534-381148898bb4?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: 4.6,
            reviews: 78,
            category: "Juice",
            inStock: true,
        },
        {
            id: 9,
            name: "Sparkling Water",
            price: 1.99,
            image: "https://images.unsplash.com/photo-1616118132534-381148898bb4?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: 4.4,
            reviews: 45,
            category: "Water",
            inStock: true,
        },
        {
            id: 10,
            name: "Lemonade Mix",
            price: 3.29,
            image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: 4.5,
            reviews: 34,
            category: "Mixes",
            inStock: true,
        },
        {
            id: 11,
            name: "Dr Pepper",
            price: 2.89,
            image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: 4.7,
            reviews: 156,
            category: "Soft Drinks",
            inStock: true,
        },
        {
            id: 12,
            name: "Mountain Dew",
            price: 2.69,
            image: "https://plus.unsplash.com/premium_photo-1667543228378-ec4478ab2845?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: 4.6,
            reviews: 89,
            category: "Soft Drinks",
            inStock: true,
        },
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
                return b.rating - a.rating;
            case "name":
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="pb-8 px-4 sm:px-8 lg:px-16 xl:px-32">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="text-center mb-8 py-10"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                Shop All Drinks
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
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
                            <div className="relative max-w-2xl border-4 p-6 py-4 mx-auto flex items-center rounded-full">
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
                                        <Badge
                                            variant="default"
                                            className="ml-2 text-xs">
                                            {category.count}
                                        </Badge>
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
                            {sortedProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.8 + index * 0.1,
                                    }}>
                                    <ProductCard {...product} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* No Results */}
                        {sortedProducts.length === 0 && (
                            <motion.div
                                className="text-center py-16"
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
                                    Try adjusting your search or filter criteria
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
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
