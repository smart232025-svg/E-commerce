/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, AlertCircle, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 text-center">

                    {/* أيقونة */}
                    <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        التسجيل غير متاح
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        يمكنك الآن الشراء من متجرنا <strong>بدون إنشاء حساب</strong>.
                        فقط أضف المنتجات التي تريدها إلى السلة وأكمل عملية الشراء.
                    </p>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 mb-6 text-right">
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            💡 <strong>ملاحظة:</strong> حساب الأدمن فقط هو المسموح له بتسجيل الدخول لإدارة المتجر.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            العودة للتسوق
                        </Link>

                        <Link
                            href="/auth/login"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            تسجيل دخول الأدمن
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
