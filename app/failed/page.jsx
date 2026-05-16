
"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function FailedPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    فشل الدفع
                </h1>

                <p className="text-gray-600 mb-6">
                    حدث خطأ أثناء عملية الدفع. يرجى المحاولة مرة أخرى أو استخدام طريقة دفع مختلفة.
                </p>

                <Link
                    href="/cart"
                    className="inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
                >
                    العودة للسلة
                </Link>
            </div>
        </div>
    );
}