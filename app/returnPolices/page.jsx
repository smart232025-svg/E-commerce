"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Shield, RefreshCw, FileText } from "lucide-react";

export default function PoliciesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* العودة للرئيسية */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    العودة للرئيسية
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
                            سياسات الموقع
                        </h1>




                        {/* ===== سياسة الاسترجاع ===== */}
                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 text-indigo-500" />
                                سياسة الاسترجاع والاستبدال
                            </h2>
                            <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                <p><strong>1. فترة الاسترجاع:</strong> يمكنك إرجاع المنتجات خلال <strong>14 يوماً</strong> من تاريخ الاستلام.</p>
                                <p><strong>2. شروط الاسترجاع:</strong> يجب أن تكون المنتجات في حالتها الأصلية وغير مستخدمة.</p>
                                <p><strong>3. المنتجات غير القابلة للاسترجاع:</strong> المنتجات  المستعملة لا تقبل الاسترجاع.</p>
                                <p><strong>4. الاستبدال:</strong> في حالة وجود عيب مصنعي، نستبدل المنتج مجاناً.</p>
                            </div>
                        </section>

                        {/* ===== تواصل معنا ===== */}
                        <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                لديك استفسار؟
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                تواصل معنا عبر البريد الإلكتروني أو الهاتف وسنرد عليك في أقرب وقت.
                            </p>
                         <div className="flex flex-wrap gap-3">
                                <a
                                    href="mailto:smart232025@gmail.com"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
                                >
                                    <Mail className="w-4 h-4" />
                                    smart232025@gmail.com
                                </a>
                                <a
                                    href="tel:+201038756048"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors text-sm"
                                >
                                    <Phone className="w-4 h-4" />
                                    01038756048
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
