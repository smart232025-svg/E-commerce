/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Calendar, Loader2 } from "lucide-react";

function ProfileContent() {
    const { user, isAuthenticated, isloading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isloading && !isAuthenticated) router.push("/auth/login");
    }, [isloading, isAuthenticated, router]);

    if (isloading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );

    if (!isAuthenticated || !user) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <User className="w-10 h-10" />
                        <h1 className="text-3xl font-bold">ملفى الشخصى</h1>
                    </div>
                    <p className="text-indigo-100 text-lg">
                        معلومات حسابك الشخصية                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-4xl font-bold text-white">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </span>
                            </div>

                            {/* Info */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {user.name}
                                </h2>

                                <div className="flex items-center gap-2 mt-2">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
                                                    ${user.role === "admin"
                                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        <Shield className="w-3.5 h-3.5" />
                                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="p-8">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            معلومات الحساب                        </h3>

                        <div className="space-y-4">
                            {[
                                { icon: User, label: "الإسم بالكامل", value: user.name },
                                { icon: Mail, label: "البريد الإلكترونى", value: user.email },
                                {
                                    icon: Shield,
                                    label: "نوع الحساب",
                                    value:
                                        user.role?.charAt(0).toUpperCase() + user.role?.slice(1),
                                },
                                {
                                    icon: Calendar,
                                    label: "رقم الحساب",
                                    value: user._id,
                                    mono: true,
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition"
                                >
                                    {/* Icon */}
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate" >
                                            {item.label}
                                        </p>

                                        <p
                                            className={`
        font-medium text-gray-900 dark:text-white truncate
        ${item.mono ? "font-mono text-sm" : ""}
        ${item.label === "البريد الإلكترونى" ? "md:text-right text-left" : ""}
    `}
                                            dir={item.label === "البريد الإلكترونى" ? "ltr" : "rtl"}
                                            title={item.value}
                                        >
                                            {item.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
}

export default function ProfilePage() {
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
    return <ProfileContent />;
}
