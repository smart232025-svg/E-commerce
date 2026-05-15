/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingBag,
    DollarSign,
    Loader2,
    ArrowRight,
    Clock,
    ArrowLeft,
} from "lucide-react";

function DashboardContent() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();


    const fetchStats = async () => {
        try {
            const res = await fetch("/api/dashboard/stats", {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch stats");
            setStats(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) router.push("/auth/login");
            else if (user?.role !== "admin") router.push("/");
        }
    }, [isAuthenticated, authLoading, user, router]);

    useEffect(() => {
        if (isAuthenticated && user?.role === "admin") fetchStats();
    }, [isAuthenticated, user]);


    if (authLoading || isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );

    if (!isAuthenticated || user?.role !== "admin") return null;

    const statCards = [
        {
            title: "عدد المستخدمين",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "#3b82f6",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            title: "عدد المنتجات",
            value: stats?.totalProducts || 0,
            icon: Package,
            color: "#22c55e",
            bgColor: "bg-green-50 dark:bg-green-900/20",
        },
        {
            title: "عدد الطلبات",
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            color: "#a855f7",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
        },
        {
            title: "إجمالى الربح",
            value: ` ${(stats?.totalRevenue || 0).toFixed(2)} ج.م`,
            icon: DollarSign,
            color: "#f59e0b",
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
        },
    ];
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

            <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-12">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex items-center gap-3 mb-4">
                        <LayoutDashboard className="w-10 h-10" />

                        <h1 className="text-3xl font-bold">
                            لوحة التحكم
                        </h1>
                    </div>

                    <p className="text-indigo-100 text-lg">
                        إدارة ، تخزين ، مشاهدة الإحصائيات                    </p>

                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    {statCards.map((stat, idx) => {

                        const Icon = stat.icon;

                        return (
                            <div
                                key={idx}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                        <Icon className="w-6 h-6" style={{ color: stat.color }} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );

                    })}

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    <Link
                        href="/dashboard/products"
                        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 
                        border border-gray-200 dark:border-gray-700 hover:border-indigo-300 transition-all"
                    >

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                    <Package className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        إدارة المنتجات                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        إضافة ، تعديل ، حذف المنتجات                                    </p>
                                </div>
                            </div>
                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/orders"
                        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 
                        border border-gray-200 dark:border-gray-700 hover:border-indigo-300 transition-all"
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-4">

                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                    <ShoppingBag className="w-6 h-6 text-purple-600" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        إدارة الطلبات                                    </h3>

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        مشاهدة وإدارة كل الطلبات                                    </p>
                                </div>

                            </div>

                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />

                        </div>

                    </Link>

                </div>
                {/* <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Recent Orders
                            </h3>
                        </div>
                    </div>

                    {stats?.recentOrders?.length > 0 ? (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50 dark:bg-gray-700/50">

                                    <tr>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Order ID
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Customer
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Total
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Date
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">

                                    {stats.recentOrders.map((order) => (

                                        <tr
                                            key={order._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                        >

                                            <td className="px-6 py-4 font-mono text-sm text-gray-900 dark:text-white">
                                                {order._id.slice(-8)}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                {order.user?.name || "Unknown"}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                EGP{order.totalPrice?.toFixed(2) || "0.00"}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === "paid"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>

                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    ) : (

                        <div className="p-8 text-center text-gray-500">
                            No recent orders
                        </div>

                    )}

                </div> */}

            </div>

        </div>
    );
}

export default function AdminDashboardPage() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
    )
    return <DashboardContent />
}