/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import {
    Bell,
    Loader2,
    CheckCheck,
    Info,
    AlertCircle,
    ShoppingBag,
    Package,
} from "lucide-react";
import MarkAllReadButton from "@/components/ui/MarkAllReadButton";

function NotificationsContent() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications", {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch notifications");
            const data = await res.json();
            setNotifications(data.notifications);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.push("/auth/login");
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) fetchNotifications();
    }, [isAuthenticated]);

    const markAsRead = async (id) => {
        try {
            const res = await fetch(`/api/notifications/${id}/read`, {
                method: "PATCH",
                credentials: "include",
            });
            setNotifications(
                notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
            );
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const handleMarkAllRead = () =>
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));

    const getNotificationIcon = (type) => {
        switch (type) {
            case "order":
                return <ShoppingBag className="w-5 h-5 text-indigo-500" />;
            case "product":
                return <Package className="w-5 h-5 text-green-500" />;
            case "alert":
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };
    if (authLoading || isLoading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );

    if (!isAuthenticated) return null;
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Bell className="w-10 h-10" />
                                <h1 className="text-3xl font-bold">Notifications</h1>
                                {unreadCount > 0 && (
                                    <span className="px-3 py-1 rounded-full bg-white/20 font-medium">
                                        {unreadCount} unread
                                    </span>
                                )}
                            </div>
                            <p className="text-indigo-100 text-lg">
                                Stay updated with your activity
                            </p>
                        </div>
                        {notifications.length > 0 && unreadCount > 0 && (
                            <MarkAllReadButton onSuccess={handleMarkAllRead} />
                        )}
                    </div>
                </div>
            </div>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-gray-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {notifications.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                        <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl text-gray-700 font-semibold dark:text-gray-300 mb-2">
                            No notifications found
                        </h3>
                    </div>
                ) : (

                    <div className="space-y-4">
                        {notifications.map((n) => (
                            <div
                                key={n._id}
                                onClick={() => !n.isRead && markAsRead(n._id)}
                                className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm
            ${n.isRead
                                        ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                        : "bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100/70 dark:hover:bg-indigo-950/40"
                                    }`}
                            >
                                {/* unread dot */}
                                {!n.isRead && (
                                    <span className="absolute top-5 right-5 w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                                )}

                                <div className="flex items-start gap-4">
                                    {/* icon */}
                                    <div
                                        className={`p-3 rounded-xl shrink-0
                    ${n.isRead
                                                ? "bg-gray-100 dark:bg-gray-700"
                                                : "bg-indigo-100 dark:bg-indigo-900/40"
                                            }`}
                                    >
                                        {getNotificationIcon(n.type)}
                                    </div>

                                    {/* content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-3">
                                            <h4
                                                className={`text-sm sm:text-base font-semibold
                            ${n.isRead
                                                        ? "text-gray-800 dark:text-gray-200"
                                                        : "text-gray-950 dark:text-white"
                                                    }`}
                                            >
                                                {n.title}
                                            </h4>

                                            {n.isRead && (
                                                <CheckCheck className="w-4 h-4 text-green-500 shrink-0" />
                                            )}
                                        </div>

                                        <p
                                            className={`mt-2 text-sm leading-6
                        ${n.isRead
                                                    ? "text-gray-600 dark:text-gray-400"
                                                    : "text-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            {n.message}
                                        </p>

                                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                                            {new Date(n.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
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

export default function NotificationsPage() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>)
    return <NotificationsContent />
}