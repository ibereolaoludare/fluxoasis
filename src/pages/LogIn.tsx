import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "motion/react";
import {
    EyeSlashIcon,
    LockIcon,
    EnvelopeIcon,
    EyeIcon,
} from "@phosphor-icons/react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Link } from "wouter";
import { checkUser, supabase } from "@/supabase";
import { navigate } from "wouter/use-browser-location";
import { toast } from "sonner";

export default function LogIn() {
    const [checking, setChecking] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState<CheckedState>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkUser("return").then((isLoggedIn) => {
            if (isLoggedIn) {
                navigate("/home");
            } else {
                setChecking(false);
            }
        });
    }, []);

    if (checking) {
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            toast.error("Error: " + error.message);
            setIsLoading(false);
        } else {
            toast.success("Logged in successfully.");
            setIsLoading(false);
            navigate("/");
        }
    };

    return (
        <motion.div
            className="h-screen bg-background flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            <motion.div
                className="w-full max-w-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}>
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}>
                    <Link to="/home">
                        <motion.div
                            className="flex items-center justify-center mb-6"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            <motion.div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">
                                    F
                                </span>
                            </motion.div>
                            <span className="ml-2 text-xl sm:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                FluxOasis
                            </span>
                        </motion.div>
                    </Link>
                    <motion.h1
                        className="text-2xl font-bold text-foreground mb-1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}>
                        Welcome back
                    </motion.h1>
                    <motion.p
                        className="text-muted-foreground"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}>
                        Sign in to your account
                    </motion.p>
                </motion.div>

                {/* Login Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="text-foreground">
                            Email
                        </Label>
                        <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`pl-10 ${
                                    errors.email
                                        ? "border-destructive focus-visible:ring-destructive/50"
                                        : ""
                                }`}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="password"
                            className="text-foreground">
                            Password
                        </Label>
                        <div className="relative">
                            <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`pl-10 pr-10 ${
                                    errors.password
                                        ? "border-destructive focus-visible:ring-destructive/50"
                                        : ""
                                }`}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                disabled={isLoading}>
                                {showPassword ? (
                                    <EyeSlashIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={setRememberMe}
                                disabled={isLoading}
                            />
                            <Label
                                htmlFor="remember"
                                className="text-sm text-muted-foreground">
                                Remember me
                            </Label>
                        </div>
                        <button
                            type="button"
                            className="text-sm text-primary hover:text-primary/80 transition-colors">
                            Forgot password?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full !p-6 rounded-full font-medium"
                        disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </motion.form>

                {/* Social Login Buttons */}
                <div>
                    <Button
                        variant="outline"
                        className="w-full shadow-none mt-4 !p-6 rounded-full"
                        disabled={isLoading}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 488 512">
                            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                        </svg>{" "}
                        Sign In With Google
                    </Button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-primary hover:text-primary/80 font-medium transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
