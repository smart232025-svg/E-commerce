/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import {
    Package,
    Loader2,
    ShoppingBag,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function OrdersContent() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [authLoading, isAuthenticated, router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders/myorders", {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch orders");
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    // const getStatusBadge = (status) => {
    //     const statusConfig = {
    //         pending: {
    //             color:
    //                 "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    //             icon: Clock,
    //             text: "قيد الانتظار",

    //         },
    //         paid: {
    //             color:
    //                 "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    //             icon: CheckCircle,
    //         },
    //         cancelled: {
    //             color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    //             icon: XCircle,
    //         },
    //         processing: {
    //             color:
    //                 "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    //             icon: Package,
    //         },
    //     };

    //     const config = statusConfig[status] || statusConfig.pending;
    //     const Icon = config.icon;
    //     return (
    //         <span
    //             className={`inline-flex items-center gap-1.5 px-3 py-1  rounded-full text-sm font-medium ${config.color}`}
    //         >
    //             <Icon className="w-4 h-4" />
    //             {status.charAt(0).toUpperCase() + status.slice(1)}
    //         </span>
    //     );
    // };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                icon: Clock,
                text: "قيد الانتظار",
            },
            confirmed: {
                color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                icon: CheckCircle,
                text: "تم التأكيد",
            },
            shipping: {
                color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
                icon: Package,
                text: "جارٍ الشحن",
            },
            delivered: {
                color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                icon: CheckCircle,
                text: "تم التوصيل",
            },
            cancelled: {
                color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                icon: XCircle,
                text: "ملغي",
            },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
            >
                <Icon className="w-4 h-4" />
                {config.text}
            </span>
        );
    };
    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }
    if (!isAuthenticated) return null;
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <ShoppingBag className="w-10 h-10" />
                        <h1 className="text-3xl font-bold">طلباتى</h1>
                    </div>
                    <p className="text-indigo-100 text-lg">
                        متابعة وإدارة حالة الطلبات                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
                {error && (
                    <div>
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    </div>
                )}
                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                        <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            لا يوجد منتجات حتى الأن                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            إبدأ التسوق الأن لترى طلباتك هنا                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" /> الذهاب للتسوق
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mt-3"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            رقم الطلب                                        </p>
                                        <p className="font-mono text-gray-900 dark:text-white">
                                            {order._id}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="space-y-3">
                                        {order.orderItems.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0">
                                                    {item.image ? (
                                                        <Image
                                                            width={100}
                                                            height={100}
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        الكمية:{item.qty}
                                                    </p>
                                                </div>
                                                <p className="font-medium text-gray-900 dark:text-white">{item.price.toFixed(2)} ج.م </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">

                                    {/* Date */}
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>

                                    {/* Total */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            الاجمالى                                        </span>
                                        <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                                            {order.totalPrice?.toFixed(2) ?? "0.00"}  ج.م
                                        </span>
                                    </div>

                                </div>
                            </div>

                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OrdersPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    return <OrdersContent />;
}