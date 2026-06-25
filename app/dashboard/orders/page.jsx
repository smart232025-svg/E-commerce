/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import {
    ShoppingBag,
    Loader2,
    Package,
    AlertCircle,
    User,
    FileText,
} from "lucide-react";

function OrdersContent() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders", {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch orders");

            const data = await res.json();
            setOrders(data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) router.push("/auth/login");
            else if (user?.role !== "admin") router.push("/");
        }
    }, [authLoading, isAuthenticated, user, router]);

    useEffect(() => {
        if (isAuthenticated && user?.role === "admin") {
            fetchOrders();
        }
    }, [isAuthenticated, user]);

    const getAvailableStatuses = (currentStatus) => {
        const transitions = {
            pending: ["confirmed", "cancelled"],
            confirmed: ["shipping", "cancelled"],
            shipping: ["delivered", "cancelled"],
            delivered: [],
            cancelled: [],
        };
        return transitions[currentStatus] || [];
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            setOrders((prev) =>
                prev.map((o) =>
                    o._id === orderId ? { ...o, status: newStatus } : o
                )
            );

            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to update status");
            }
        } catch (error) {
            setError(error.message);
            fetchOrders();
        }
    };

    const getStatusBadge = (status) => {
        const cfg = {
            pending: { color: "bg-yellow-100 text-yellow-800", label: "قيد الانتظار" },
            confirmed: { color: "bg-blue-100 text-blue-800", label: "تم التأكيد" },
            shipping: { color: "bg-purple-100 text-purple-800", label: "جارى التوصيل" },
            delivered: { color: "bg-green-100 text-green-800", label: "تم التوصيل" },
            cancelled: { color: "bg-red-100 text-red-800", label: "ملغى" },
        };

        const c = cfg[status] || cfg.pending;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${c.color}`}>
                {c.label}
            </span>
        );
    };
    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== "admin") return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-2">
                        <ShoppingBag className="w-10 h-10" />
                        <h1 className="text-3xl font-bold">إدارة الطلبات</h1>
                    </div>
                    <p className="text-indigo-100">مشاهدة وإدارة كل طلبات العملاء</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-100 dark:bg-gray-700 rounded-2xl">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl text-gray-500 dark:text-white font-semibold">لا يوجد أى طلبات</h3>
                        <p className="dark:text-gray-300 text-gray-500">طلباتك سوف تظهر هنا ، عند الطلب</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
                            >
                                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">طلب #</span>
                                            <span className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
                                                {order._id.slice(-8)}
                                            </span>
                                            {getStatusBadge(order.status)}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-3">
                                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                <User className="w-4 h-4 text-indigo-500" />
                                                بيانات العميل
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-medium">الاسم:</span>{' '}
                                                    {order.customer?.name || order.user?.name || "-"}
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                                    {/* <Phone className="w-3.5 h-3.5 text-gray-400" /> */}
                                                    <span className="font-medium">الرقم:</span>{' '}
                                                    {order.customer?.phone || "-"}
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                                    {/* <MapPin className="w-3.5 h-3.5 text-gray-400" /> */}
                                                    <span className="font-medium">المحافظة : </span>{' '}
                                                    {order.customer?.governorate || "-"}
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-medium">المدينة :</span>{' '}
                                                    {order.customer?.city || "-"}
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-medium">العنوان :</span>{' '}
                                                    {order.customer?.address || "-"}
                                                </p>
                                                {order.customer?.notes && (
                                                    <p className="text-gray-700 dark:text-gray-300 flex items-start gap-1">
                                                        <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                                        <span className="font-medium">ملاحظات:</span>{' '}
                                                        {order.customer.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                                <Package className="w-4 h-4 text-indigo-500" />
                                                المنتجات
                                            </h3>
                                            <div className="space-y-2">
                                                {order.orderItems?.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm">
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {item.name} × {item.qty}
                                                        </span>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {(item.price * item.qty)} ج.م
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-500 dark:text-gray-400">إجمالي الطلب</span>
                                                    <span className="text-2xl font-bold text-indigo-600">
                                                        {order.totalPrice?.toFixed(2)} ج.م
                                                    </span>
                                                </div>
                                                {/* <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                                    شامل الضرائب
                                                </div> */}
                                            </div>



                                            {/* <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    تغيير الحالة
                                                </label>
                                                <select
                                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-2 text-sm"
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                                    disabled={getAvailableStatuses(order.status).length === 0}
                                                >
                                                    <option value={order.status}>
                                                        {order.status === "pending" && "قيد الانتظار"}
                                                        {order.status === "confirmed" && "تم التأكيد"}
                                                        {order.status === "shipping" && "جارى التوصيل"}
                                                        {order.status === "delivered" && "تم التوصيل"}
                                                        {order.status === "cancelled" && "ملغى"}
                                                    </option>

                                                    {getAvailableStatuses(order.status).map((s) => (
                                                        <option key={s} value={s}>
                                                            {s === "confirmed" && "تم التأكيد"}
                                                            {s === "shipping" && "جارى التوصيل"}
                                                            {s === "delivered" && "تم التوصيل"}
                                                            {s === "cancelled" && "ملغى"}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div> */}
                                        </div>
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

export default function AdminOrderPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return <OrdersContent />;
}
