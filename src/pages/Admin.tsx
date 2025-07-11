import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
    ChartLineIcon,
    PackageIcon,
    StorefrontIcon,
    UsersIcon,
    PlusIcon,
    XIcon,
    CheckIcon,
} from "@phosphor-icons/react";
import { Link, useSearchParams } from "wouter";
import Header from "@/components/ui/header";
import { supabase } from "@/supabase";
import { navigate } from "wouter/use-browser-location";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { UploadIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    PaginationState,
} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Tables, TablesInsert } from "@/supabase.type";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Helper function to fetch user data securely via edge function
// Helper function to fetch multiple users securely via edge function
const fetchUsersData = async (userIds: string[]) => {
    try {
        const { data, error } = await supabase.functions.invoke(
            "get-user-by-id",
            {
                body: { userIds },
            }
        );

        if (error) {
            throw new Error(error.message || "Failed to fetch users");
        }

        return data.users || {};
    } catch (err: any) {
        console.error("Failed to fetch users data:", err);
        return {};
    }
};

// Placeholder admin section components
function DashboardSection() {
    const [range, setRange] = useState<"daily" | "monthly" | "yearly" | "all">(
        "daily"
    );
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [, setLoading] = useState(true);
    const [users, setUsers] = useState<Record<string, any>>({});
    const [, setUserError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setUserError(null);
            const { data: ordersData } = await supabase
                .from("orders")
                .select("*");
            const { data: productsData } = await supabase
                .from("products")
                .select("*");
            setOrders(ordersData || []);
            setProducts(productsData || []);
            setLoading(false);

            // Fetch user info for recent orders
            if (ordersData && ordersData.length > 0) {
                // Get the latest 5 orders by created_at
                const sorted = ordersData
                    .slice()
                    .sort(
                        (a, b) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                    );
                const recent = sorted.slice(0, 5);
                const userIds = Array.from(
                    new Set(recent.map((o) => o.user_id))
                );

                try {
                    const usersData = await fetchUsersData(userIds);
                    let usersMap: Record<string, any> = {};

                    for (const userId of userIds) {
                        const user = usersData[userId];
                        if (user) {
                            usersMap[userId] = {
                                name:
                                    user.name ||
                                    user.email?.split("@")[0] ||
                                    "User",
                                email: user.email,
                                phone: user.phone || "",
                            };
                        } else {
                            usersMap[userId] = {
                                name: "Unknown",
                                email: "",
                                phone: "",
                            };
                        }
                    }
                    setUsers(usersMap);
                } catch (err: any) {
                    setUserError(`Error fetching user info: ${err.message}`);
                }
            }
        })();
    }, []);

    // Helper: get start of today/month/year
    const getStart = (type: "daily" | "monthly" | "yearly") => {
        const now = new Date();
        if (type === "daily")
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (type === "monthly")
            return new Date(now.getFullYear(), now.getMonth(), 1);
        if (type === "yearly") return new Date(now.getFullYear(), 0, 1);
        return new Date(0);
    };
    // Filter orders by range
    const filteredOrders = orders.filter((order) => {
        if (range === "all") return true;
        const start = getStart(range);
        return new Date(order.created_at) >= start;
    });
    // Metrics
    const totalSales = filteredOrders.reduce(
        (sum, o) => sum + (o.order?.total || 0),
        0
    );
    const orderCount = filteredOrders.length;
    const customerCount = new Set(filteredOrders.map((o) => o.user_id)).size;
    const productCount = products.length;
    // Metrics cards
    const metrics = [
        {
            label: "Total Sales",
            value: formatPrice(totalSales),
            icon: ChartLineIcon,
        },
        {
            label: "Orders",
            value: orderCount.toLocaleString(),
            icon: PackageIcon,
        },
        {
            label: "Customers",
            value: customerCount.toLocaleString(),
            icon: UsersIcon,
        },
        {
            label: "Products",
            value: productCount.toLocaleString(),
            icon: StorefrontIcon,
        },
    ];
    // Sales chart data
    let salesLabels: string[] = [];
    let salesDataArr: number[] = [];
    if (range === "daily") {
        // 6 time buckets for today
        salesLabels = ["12am", "4am", "8am", "12pm", "4pm", "8pm"];
        salesDataArr = Array(6).fill(0);
        filteredOrders.forEach((o) => {
            const hour = new Date(o.created_at).getHours();
            const idx = Math.floor(hour / 4);
            salesDataArr[idx] += o.order?.total || 0;
        });
    } else if (range === "monthly") {
        // 4 weeks
        salesLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
        salesDataArr = Array(4).fill(0);
        filteredOrders.forEach((o) => {
            const day = new Date(o.created_at).getDate();
            const idx = Math.min(Math.floor((day - 1) / 7), 3);
            salesDataArr[idx] += o.order?.total || 0;
        });
    } else if (range === "yearly") {
        // 12 months
        salesLabels = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        salesDataArr = Array(12).fill(0);
        filteredOrders.forEach((o) => {
            const month = new Date(o.created_at).getMonth();
            salesDataArr[month] += o.order?.total || 0;
        });
    } else {
        // all: by year
        const years = Array.from(
            new Set(orders.map((o) => new Date(o.created_at).getFullYear()))
        ).sort();
        salesLabels = years.map((y) => y.toString());
        salesDataArr = years.map((y) =>
            orders
                .filter((o) => new Date(o.created_at).getFullYear() === y)
                .reduce((sum, o) => sum + (o.order?.total || 0), 0)
        );
    }
    const salesData = {
        labels: salesLabels,
        datasets: [
            {
                label: "Sales",
                data: salesDataArr,
                backgroundColor: "#222",
                borderRadius: 8,
                maxBarThickness: 32,
            },
        ],
    };
    const salesOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "#f3f4f6" }, beginAtZero: true },
        },
    };
    // Recent orders (latest 5)
    const recentOrders = filteredOrders
        .slice()
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        )
        .slice(0, 5)
        .map((order) => ({
            id: `ORD-${String(order.id).padStart(3, "0")}`,
            customer: users[order.user_id]?.name || order.user_id,
            total: formatPrice(order.order?.total),
            status: order.order_state,
            date: new Date(order.created_at).toLocaleDateString("en-GB"),
        }));

    return (
        <motion.div
            className="w-full rounded-2xl p-0 sm:p-8 space-y-8 bg-background"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            {/* Range Selector */}
            <div className="flex gap-2 mb-4">
                {(["daily", "monthly", "yearly", "all"] as const).map((r) => (
                    <button
                        key={r}
                        className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${
                            range === r
                                ? "bg-foreground text-background"
                                : "bg-background text-foreground border-border hover:bg-muted"
                        }`}
                        onClick={() => setRange(r)}
                        type="button">
                        {r === "daily"
                            ? "Daily"
                            : r === "monthly"
                            ? "Monthly"
                            : r === "yearly"
                            ? "Yearly"
                            : "All Time"}
                    </button>
                ))}
            </div>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {metrics.map((m) => (
                    <div
                        key={m.label}
                        className="rounded-2xl p-5 flex items-center gap-4 bg-background text-foreground border border-border">
                        <m.icon className="w-7 h-7 flex-shrink-0" />
                        <div>
                            <div className="text-lg font-bold leading-tight">
                                {m.value}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                                {m.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Sales Chart */}
            <div className="bg-background rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">Sales</h3>
                </div>
                <div className="h-64 w-full">
                    <Bar
                        data={salesData}
                        options={salesOptions}
                    />
                </div>
            </div>
            {/* Recent Orders Table */}
            <div className="bg-background rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">
                        Recent Orders
                    </h3>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-foreground">
                                    {order.id}
                                </TableCell>
                                <TableCell className="text-foreground">
                                    {order.customer}
                                </TableCell>
                                <TableCell className="text-foreground">
                                    {order.total}
                                </TableCell>
                                <TableCell className="text-foreground font-semibold capitalize">
                                    {order.status}
                                </TableCell>
                                <TableCell className="text-foreground">
                                    {order.date}
                                </TableCell>
                                <TableCell>
                                    <Link to="/admin?section=orders">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="shadow-none hover:bg-foreground hover:text-background rounded-full">
                                            View
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </motion.div>
    );
}
function ProductsSection() {
    const [products, setProducts] = useState<Tables<"products">[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        inStock: true,
        image: "",
    });
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [editProduct, setEditProduct] = useState<Tables<"products"> | null>(
        null
    );

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

    // Create product
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError(null);
        if (
            !form.name ||
            !form.price ||
            !form.category ||
            (!editProduct && imageFile === null)
        ) {
            setFormError("All fields are required, including an image.");
            toast.error("All fields are required, including an image.");
            return;
        }
        if (editProduct) {
            // Update product (excluding image)
            const { error } = await supabase
                .from("products")
                .update({
                    name: form.name,
                    price: parseFloat(form.price),
                    category: form.category,
                    inStock: form.inStock,
                })
                .eq("id", editProduct.id);
            let imageUpdated = false;
            if (imageFile) {
                // Remove existing image
                const fileName = `images/${editProduct.id}.jpg`;
                await supabase.storage.from("products").remove([fileName]);
                // Upload new image
                const { error: uploadError } = await supabase.storage
                    .from("products")
                    .upload(fileName, imageFile, {
                        upsert: true,
                        contentType: "image/jpeg",
                    });
                if (!uploadError) {
                    const { data: urlData } = supabase.storage
                        .from("products")
                        .getPublicUrl(fileName);
                    await supabase
                        .from("products")
                        .update({ image: urlData.publicUrl })
                        .eq("id", editProduct.id);
                    imageUpdated = true;
                } else {
                    toast.error("Image upload failed.");
                }
            }
            if (!error && (!imageFile || imageUpdated)) {
                // Update local state
                const { data: newData } = await supabase
                    .from("products")
                    .select("*")
                    .order("id", { ascending: true });
                if (newData) setProducts(newData);
                setOpen(false);
                setEditProduct(null);
                setForm({
                    name: "",
                    price: "",
                    category: "",
                    inStock: true,
                    image: "",
                });
                setImageFile(null);
                toast.success("Product updated successfully.");
            } else if (!imageUpdated && imageFile) {
                setFormError(
                    "Failed to update product image. Please try again."
                );
            } else {
                setFormError("Failed to update product. Please try again.");
                toast.error("Failed to update product. Please try again.");
            }
            return;
        }
        // Insert product first (without image)
        const newProduct: TablesInsert<"products"> = {
            name: form.name,
            price: parseFloat(form.price),
            category: form.category,
            inStock: Boolean(form.inStock),
            ratings: 0,
            reviews: null,
        };
        const { data, error } = await supabase
            .from("products")
            .insert([newProduct])
            .select();
        if (!error && data && data[0]) {
            let imageUrl = "";
            if (imageFile) {
                // Upload image to storage
                const fileName = `images/${data[0].id}.jpg`;
                const { error: uploadError } = await supabase.storage
                    .from("products")
                    .upload(fileName, imageFile, {
                        upsert: true,
                        contentType: "image/jpeg",
                    });
                if (!uploadError) {
                    const { data: urlData } = supabase.storage
                        .from("products")
                        .getPublicUrl(fileName);
                    imageUrl = urlData.publicUrl;
                    // Update product row with image URL
                    await supabase
                        .from("products")
                        .update({ image: imageUrl })
                        .eq("id", data[0].id);
                } else {
                    toast.error("Image upload failed.");
                }
            }
            // Refetch products to get the updated image URL
            const { data: newData } = await supabase
                .from("products")
                .select("*")
                .order("id", { ascending: true });
            if (newData) setProducts(newData);
            setOpen(false);
            setForm({
                name: "",
                price: "",
                category: "",
                inStock: true,
                image: "",
            });
            setImageFile(null);
            toast.success("Product created successfully.");
        } else {
            setFormError("Failed to create product. Please try again.");
            toast.error("Failed to create product. Please try again.");
        }
    }

    function openEditDialog(product: Tables<"products">) {
        setEditProduct(product);
        setForm({
            name: product.name,
            price: product.price.toString(),
            category: product.category,
            inStock: Boolean(product.inStock),
            image: "",
        });
        setOpen(true);
        setFormError(null);
    }
    async function handleDelete(id: number) {
        // Delete image from storage first (now in 'images/' subfolder)
        const fileName = `images/${id}.jpg`;
        await supabase.storage.from("products").remove([fileName]);
        // Then delete the product row
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (!error) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success("Product deleted successfully.");
        } else {
            toast.error("Failed to delete product. Please try again.");
        }
    }

    // DataTable state
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });

    // DataTable columns
    const columns = React.useMemo<ColumnDef<any, any>[]>(
        () => [
            {
                accessorKey: "id",
                header: "ID",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "name",
                header: "Name",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "category",
                header: "Category",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "price",
                header: "Price",
                cell: (info) => formatPrice(Number(info.getValue())),
            },
            {
                accessorKey: "inStock",
                header: "Stock",
                cell: (info) =>
                    info.getValue() ? (
                        <span className="text-green-600 font-semibold">
                            In Stock
                        </span>
                    ) : (
                        <span className="text-muted-foreground">
                            Out of Stock
                        </span>
                    ),
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="rounded-full">
                                    <span className="sr-only">Open menu</span>
                                    <svg
                                        width="20"
                                        height="20"
                                        fill="none"
                                        viewBox="0 0 20 20">
                                        <circle
                                            cx="10"
                                            cy="4"
                                            r="1.5"
                                            fill="currentColor"
                                        />
                                        <circle
                                            cx="10"
                                            cy="10"
                                            r="1.5"
                                            fill="currentColor"
                                        />
                                        <circle
                                            cx="10"
                                            cy="16"
                                            r="1.5"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() =>
                                        openEditDialog(row.original)
                                    }>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() =>
                                        handleDelete(row.original.id)
                                    }>
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: products,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: false,
        pageCount: Math.ceil(products.length / pagination.pageSize),
    });

    if (loading)
        return (
            <div className="p-8 text-center text-muted-foreground">
                Loading products...
            </div>
        );

    return (
        <motion.div
            className="w-full rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            <h2 className="text-xl font-bold mb-2">Products</h2>
            <p className="text-muted-foreground text-sm mb-6">
                Manage products here.
            </p>
            <div className="flex flex-col-reverse sm:flex-row-reverse justify-between items-start gap-4 sm:gap-0 sm:items-center mb-6">
                <Button
                    onClick={() => setOpen(true)}
                    className="rounded-full shadow-none !p-6 bg-foreground hover:bg-foreground/90">
                    <PlusIcon />
                    Create Product
                </Button>
                <Input
                    placeholder="Search products..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full sm:w-96"
                />
            </div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    onClick={
                                        header.column.getCanSort()
                                            ? header.column.getToggleSortingHandler()
                                            : undefined
                                    }
                                    className={
                                        header.column.getCanSort()
                                            ? "cursor-pointer select-none"
                                            : undefined
                                    }>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {header.column.getIsSorted() === "asc" &&
                                        " ▲"}
                                    {header.column.getIsSorted() === "desc" &&
                                        " ▼"}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-center py-32">
                                No products found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex items-center justify-end gap-2 mt-4">
                <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full shadow-none"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </span>
                <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full shadow-none"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
            <Dialog
                open={open}
                onOpenChange={setOpen}>
                <DialogContent>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 bg-muted/40 rounded-xl p-6">
                        <DialogHeader>
                            <DialogTitle>
                                {editProduct
                                    ? "Edit Product"
                                    : "Create Product"}
                                {formError && (
                                    <span className="block mt-2 text-destructive text-sm font-semibold">
                                        {formError}
                                    </span>
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                {editProduct
                                    ? "Update the details for this product."
                                    : "Fill in the details to add a new product."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-foreground">
                                    Product Name
                                </label>
                                <Input
                                    name="name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            [e.target.name]: e.target.value,
                                        }))
                                    }
                                    placeholder="Product Name"
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">
                                        Price
                                    </label>
                                    <Input
                                        name="price"
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                [e.target.name]: e.target.value,
                                            }))
                                        }
                                        placeholder="Price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">
                                        Category
                                    </label>
                                    <Select
                                        value={form.category}
                                        onValueChange={(val) =>
                                            setForm((f) => ({
                                                ...f,
                                                category: val,
                                            }))
                                        }
                                        required>
                                        <SelectTrigger className="w-full py-6.5 px-4 shadow-none">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Soft Drinks">
                                                Soft Drinks
                                            </SelectItem>
                                            <SelectItem value="Energy">
                                                Energy
                                            </SelectItem>
                                            <SelectItem value="Juice">
                                                Juice
                                            </SelectItem>
                                            <SelectItem value="Water">
                                                Water
                                            </SelectItem>
                                            <SelectItem value="Mixes">
                                                Mixes
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <Checkbox
                                    id="inStock"
                                    checked={form.inStock}
                                    onCheckedChange={(checked) =>
                                        setForm((f) => ({
                                            ...f,
                                            inStock: Boolean(checked),
                                        }))
                                    }
                                />
                                <Label htmlFor="inStock">In Stock</Label>
                            </div>
                            <div className="pt-2 border-t border-border">
                                <label className="block text-sm font-medium mb-1 text-foreground">
                                    Product Image{" "}
                                    <span className="text-destructive">*</span>{" "}
                                    {editProduct && (
                                        <span className="text-xs text-muted-foreground">
                                            (optional, only if you want to
                                            change the image)
                                        </span>
                                    )}
                                </label>
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (
                                            e.target.files &&
                                            e.target.files[0]
                                        ) {
                                            const file = e.target.files[0];
                                            setImageFile(file);
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                setForm((f) => ({
                                                    ...f,
                                                    image: event.target
                                                        ?.result as string,
                                                }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="hidden"
                                    required={!editProduct}
                                    // Only allow image upload when editing or creating
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 rounded-full shadow-none !p-6 hover:bg-foreground hover:text-background"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }>
                                    <UploadIcon className="w-4 h-4" />
                                    {form.image
                                        ? "Change Image"
                                        : "Upload Image"}
                                </Button>
                                {form.image && (
                                    <img
                                        src={form.image}
                                        alt="Preview"
                                        className="mt-2 h-20 w-20 object-cover rounded-md border mx-auto"
                                    />
                                )}
                            </div>
                            {formError && (
                                <div className="text-destructive text-xs mt-2">
                                    {formError}
                                </div>
                            )}
                        </div>
                        <DialogFooter className="flex gap-2 justify-end pt-2">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-full shadow-none !p-6 hover:bg-foreground hover:text-background">
                                    <XIcon />
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                className="rounded-full shadow-none !p-6 bg-foreground hover:bg-foreground/90 hover:text-background">
                                <CheckIcon />
                                {editProduct ? "Save Changes" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
function OrdersSection() {
    const [orders, setOrders] = useState<any[]>([]);
    const [users, setUsers] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<Record<number, boolean>>({});
    const [userError, setUserError] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const orderStates = ["pending", "processing", "delivered", "cancelled"];

    useEffect(() => {
        const fetchOrdersAndUsers = async () => {
            setLoading(true);
            setUserError(null);
            // Fetch all orders
            const { data: ordersData, error: ordersError } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });
            if (ordersError) {
                setOrders([]);
                setLoading(false);
                return;
            }
            setOrders(ordersData || []);
            // Get unique user_ids
            const userIds = Array.from(
                new Set((ordersData || []).map((o: any) => o.user_id))
            );
            // Fetch user info for all users at once
            try {
                const usersData = await fetchUsersData(userIds);
                let usersMap: Record<string, any> = {};

                for (const userId of userIds) {
                    const user = usersData[userId];
                    if (user) {
                        usersMap[userId] = {
                            name:
                                user.name ||
                                user.email?.split("@")[0] ||
                                "User",
                            email: user.email,
                            phone: user.phone || "",
                        };
                    } else {
                        usersMap[userId] = {
                            name: "Unknown",
                            email: "",
                            phone: "",
                        };
                    }
                }
                setUsers(usersMap);
            } catch (err: any) {
                setUserError(`Error fetching user info: ${err.message}`);
            }
            setLoading(false);
        };
        fetchOrdersAndUsers();
    }, []);

    const handleStateChange = async (orderId: number, newState: string) => {
        setSaving((prev) => ({ ...prev, [orderId]: true }));
        const { error } = await supabase
            .from("orders")
            .update({ order_state: newState })
            .eq("id", orderId);
        if (!error) {
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId
                        ? { ...order, order_state: newState }
                        : order
                )
            );
        }
        setSaving((prev) => ({ ...prev, [orderId]: false }));
    };

    if (loading)
        return (
            <div className="p-8 text-center text-muted-foreground">
                Loading orders...
            </div>
        );

    return (
        <motion.div
            className="w-full rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            <h2 className="text-xl font-bold mb-2">Orders</h2>
            <p className="text-muted-foreground text-sm mb-6">
                View and manage all user orders. You can update the order state.
            </p>
            {userError && (
                <div className="mb-4 text-destructive text-sm font-semibold">
                    {userError}
                </div>
            )}
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        No orders found.
                    </div>
                ) : (
                    orders.map((order) => {
                        const user = users[order.user_id] || {};
                        return (
                            <div
                                key={order.id}
                                className="w-full rounded-2xl p-4 border border-border/50 bg-muted/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="w-full">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-base font-semibold font-mono">
                                            ORD-
                                            {String(order.id).padStart(3, "0")}
                                        </span>
                                        <span className="bg-green-100 capitalize text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                            {order.order_state || "Pending"}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground mb-1">
                                        <b>User:</b> {user.name}
                                        <br />
                                        <b>Email:</b> {user.email}
                                        <br />
                                        <b>Phone:</b> {user.phone}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(
                                            order.created_at
                                        ).toLocaleDateString("en-GB")}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2 w-full sm:min-w-[180px]">
                                    <span className="text-lg font-bold text-foreground">
                                        {order.order?.total
                                            ? formatPrice(order.order?.total)
                                            : "-"}
                                    </span>
                                    <Select
                                        value={order.order_state}
                                        onValueChange={(value) =>
                                            handleStateChange(order.id, value)
                                        }
                                        disabled={saving[order.id]}>
                                        <SelectTrigger className="capitalize w-[140px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {orderStates.map((state) => (
                                                <SelectItem
                                                    key={state}
                                                    value={state}
                                                    className="capitalize">
                                                    {state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full hover:bg-foreground hover:text-background shadow-none mt-2"
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setDetailsOpen(true);
                                        }}>
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {/* Order Details Dialog */}
            <Dialog
                open={detailsOpen}
                onOpenChange={setDetailsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            View the details of this order, including items,
                            status, and user info. You can update the order
                            state.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-2 flex flex-col items-start mt-2">
                            <div>
                                <b>Order ID:</b> ORD-
                                {String(selectedOrder.id).padStart(3, "0")}
                            </div>
                            <div>
                                <b>Date:</b>{" "}
                                {new Date(
                                    selectedOrder.created_at
                                ).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                            <div>
                                <b>Status:</b>{" "}
                                <span className="capitalize">
                                    {selectedOrder.order_state}
                                </span>
                                <Select
                                    value={selectedOrder.order_state}
                                    onValueChange={async (value) => {
                                        await handleStateChange(
                                            selectedOrder.id,
                                            value
                                        );
                                        setSelectedOrder((prev: any) =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      order_state: value,
                                                  }
                                                : prev
                                        );
                                    }}
                                    disabled={saving[selectedOrder.id]}>
                                    <SelectTrigger className="capitalize w-[140px] ml-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orderStates.map((state) => (
                                            <SelectItem
                                                key={state}
                                                value={state}
                                                className="capitalize">
                                                {state}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <b>User:</b>{" "}
                                {users[selectedOrder.user_id]?.name} (
                                {users[selectedOrder.user_id]?.email})
                            </div>
                            <div>
                                <b>Phone:</b>{" "}
                                {users[selectedOrder.user_id]?.phone}
                            </div>
                            <div>
                                <b>Total:</b>{" "}
                                {selectedOrder.order?.total
                                    ? Intl.NumberFormat("en-US", {
                                          style: "currency",
                                          currency: "USD",
                                      }).format(selectedOrder.order.total)
                                    : "-"}
                            </div>
                            <div className="mt-2">
                                <b>Items:</b>
                            </div>
                            <ul className="list-disc pl-6">
                                {selectedOrder.order?.items?.map(
                                    (item: any, idx: number) => (
                                        <li key={idx}>
                                            {item.name} x{item.quantity} (
                                            {Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(item.price)}{" "}
                                            each)
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button className="!p-6 bg-foreground hover:bg-foreground/90 rounded-full">
                                <XIcon />
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
export default function Admin() {
    const [checking, setChecking] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        (async () => {
            const { data, error } = await supabase.auth.getUser();
            const role = data?.user?.app_metadata?.role;
            if (error || !(role === "admin" || role === "developer")) {
                navigate("/account");
            } else {
                setIsAdmin(true);
                setChecking(false);
            }
        })();
    }, []);

    // Get active section from search params
    const activeSection = searchParams.get("section") || "dashboard";

    const sections = [
        {
            id: "dashboard",
            name: "Dashboard",
            icon: ChartLineIcon,
            component: DashboardSection,
        },
        {
            id: "products",
            name: "Products",
            icon: PackageIcon,
            component: ProductsSection,
        },
        {
            id: "orders",
            name: "Orders",
            icon: StorefrontIcon,
            component: OrdersSection,
        },
    ];

    const ActiveComponent =
        sections.find((s) => s.id === activeSection)?.component ||
        DashboardSection;

    if (checking || !isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Admin Header */}
            <Header variant="admin" />

            <div className="sm:px-4 px-0">
                <div className="px-4 sm:px-8 xl:px-32">
                    {/* Main Content Area */}
                    <ActiveComponent />
                </div>
            </div>
        </div>
    );
}
