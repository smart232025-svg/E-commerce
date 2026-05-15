"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2 } from "lucide-react";

export default function BuyButton({ productId, disabled }) {

    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleBuy = async () => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/orders/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    qty: 1,
                }),
                credentials: "include",
            });
            const data = await res.json();
            if (res.ok && data.url) {
                window.location.href = data.url;
            } else {
                alert(data.message || "Failed to create checkout session");
            }
        } catch (error) {
            alert("Failed to process checkout");
        } finally {
            setLoading(false);
        }
    };
    return (
        <button
            onClick={handleBuy}
            disabled={disabled || loading}
            className="   w-full sm:flex-1 
                flex items-center justify-center gap-3 
                px-6 py-4 
                bg-indigo-600 hover:bg-indigo-700 
                text-white 
                rounded-xl font-bold text-lg 
                transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed 
                shadow-lg shadow-indigo-500/25"        >
            {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
                <ShoppingCart className="w-6 h-6" />
            )}
            {disabled ? "Out of Stock" : "Buy Now"}
        </button>
    );
}