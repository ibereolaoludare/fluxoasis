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
    UserIcon,
    PhoneIcon,
} from "@phosphor-icons/react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Link } from "wouter";
import { checkUser, supabase } from "@/supabase";
import { navigate } from "wouter/use-browser-location";
import { toast } from "sonner";

export default function SignUp() {
    const [checking, setChecking] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agree, setAgree] = useState<CheckedState>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        checkUser("return").then((isSignedUp) => {
            if (isSignedUp) {
                navigate("/login");
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
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateStep1 = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{11}$/.test(formData.phone.replace(/\s/g, ""))) {
            newErrors.phone = "Please enter a valid phone number";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        if (!agree) {
            newErrors.agree = "You must agree to the terms";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleBack = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) return;
        setIsLoading(true);

        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.confirmPassword,
            options: {
                data: {
                    name: formData.name,
                    phone: formData.phone,
                },
            },
        });

        if (error) {
            toast.error("Error: " + error.message);
            setIsLoading(false);
        } else {
            toast.success("Signed up successfully.");
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
                        Create your account
                    </motion.h1>
                    <motion.p
                        className="text-muted-foreground"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}>
                        Sign up to get started
                    </motion.p>
                </motion.div>

                {/* Stepper Indicator */}
                <motion.div
                    className="flex justify-center mb-6 gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}>
                    <div
                        className={`w-8 h-1 rounded-full transition-all duration-300 ${
                            step === 1 ? "bg-primary" : "bg-muted-foreground/30"
                        }`}></div>
                    <div
                        className={`w-8 h-1 rounded-full transition-all duration-300 ${
                            step === 2 ? "bg-primary" : "bg-muted-foreground/30"
                        }`}></div>
                </motion.div>

                {/* Two Step Sign Up Form */}
                <form
                    onSubmit={step === 1 ? handleNext : handleSubmit}
                    className="space-y-4">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4 sm:space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-foreground">
                                    Name
                                </Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`pl-10 ${
                                            errors.name
                                                ? "border-destructive focus-visible:ring-destructive/50"
                                                : ""
                                        }`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
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
                            {/* Phone Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone"
                                    className="text-foreground">
                                    Phone
                                </Label>
                                <div className="relative">
                                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`pl-10 ${
                                            errors.phone
                                                ? "border-destructive focus-visible:ring-destructive/50"
                                                : ""
                                        }`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-sm text-destructive">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full !p-6 rounded-full font-medium"
                                disabled={isLoading}>
                                Next
                            </Button>
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4 sm:space-y-6">
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
                                        type={
                                            showPassword ? "text" : "password"
                                        }
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
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
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
                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-foreground">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`pl-10 pr-10 ${
                                            errors.confirmPassword
                                                ? "border-destructive focus-visible:ring-destructive/50"
                                                : ""
                                        }`}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        disabled={isLoading}>
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                            {/* Agree to Terms */}
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="agree"
                                    checked={!!agree}
                                    onCheckedChange={setAgree}
                                    disabled={isLoading}
                                />
                                <Label
                                    htmlFor="agree"
                                    className="text-xs text-muted-foreground">
                                    I agree to the{" "}
                                    <a
                                        href="#"
                                        className="underline">
                                        terms & conditions
                                    </a>
                                </Label>
                            </div>
                            {errors.agree && (
                                <p className="text-sm text-destructive">
                                    {errors.agree}
                                </p>
                            )}
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full !p-6 rounded-full"
                                    onClick={handleBack}
                                    disabled={isLoading}>
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-full !p-6 rounded-full"
                                    disabled={isLoading}>
                                    {isLoading ? "Signing up..." : "Sign Up"}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                    {/* Social Sign Up Button */}
                    <div>
                        <Button
                            variant="outline"
                            className="w-full shadow-none !p-6 rounded-full font-medium"
                            disabled={isLoading}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 488 512">
                                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                            </svg>{" "}
                            Sign Up With Google
                        </Button>
                    </div>
                    {/* Log In Link */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="login"
                                className="text-primary hover:text-primary/80 font-medium transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
