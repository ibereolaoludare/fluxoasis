import { clsx, type ClassValue } from "clsx";
import PaystackPop from "@paystack/inline-js";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "NGN",
    }).format(price);
}

export interface PaymentResult {
    success: boolean;
    reference?: string;
    error?: string;
}

export async function payWithPayStack(
    amount: number,
    customerData: {
        email: string;
        firstName: string;
        lastName: string;
        tel: string;
    },
    onSuccess?: (reference: string) => void,
    onError?: (error: string) => void
): Promise<PaymentResult> {
    return new Promise((resolve) => {
        try {
            const popup = new PaystackPop();
            // @ts-ignore
            popup.newTransaction({
                key: import.meta.env.VITE_PK_PAYSTACK_KEY,
                email: customerData.email,
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                phone: customerData.tel,
                amount: amount * 100, // Convert to kobo (Paystack expects amount in kobo)
                currency: "NGN",
                onSuccess: (transaction: any) => {
                    if (transaction.status === "success") {
                        const result: PaymentResult = {
                            success: true,
                            reference: transaction.reference,
                        };
                        if (onSuccess) onSuccess(transaction.reference);
                        resolve(result);
                    } else {
                        const result: PaymentResult = {
                            success: false,
                            error: "Payment was not successful",
                        };
                        if (onError) onError("Payment was not successful");
                        resolve(result);
                    }
                },
                onCancel: () => {
                    const result: PaymentResult = {
                        success: false,
                        error: "Payment was cancelled",
                    };
                    if (onError) onError("Payment was cancelled");
                    resolve(result);
                },
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Payment initialization failed";
            const result: PaymentResult = {
                success: false,
                error: errorMessage,
            };
            if (onError) onError(errorMessage);
            resolve(result);
        }
    });
}
