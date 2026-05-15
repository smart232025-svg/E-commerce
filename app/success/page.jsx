"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    تم الدفع بنجاح!
                </h1>

                <p className="text-gray-600 mb-6">
                    شكراً لتسوقك معنا. تم تأكيد طلبك وسيتم تجهيزه للشحن قريباً.
                </p>

                <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
                >
                    <ShoppingBag className="w-5 h-5" />
                    متابعة التسوق
                </Link>
            </div>
        </div>
    );
}