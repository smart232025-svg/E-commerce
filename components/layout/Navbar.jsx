// "use client";
// import Link from "next/link";
// import { useAuth } from "../providers/AuthProvider";
// import { useState } from "react";
// import {
//     Menu,
//     X,
//     ShoppingBag,
//     User,
//     LogOut,
//     LayoutDashboard,
//     Bell,
//     ShoppingCart
// } from "lucide-react";
// import { useCart } from "@/context/CartContext"
// export default function Navbar() {
//     const { user, isAuthenticated, isloading, logout } = useAuth();
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     const handleLogout = async () => {
//         await logout();
//         window.location.href = "/";
//     };
//     const { cart } = useCart()
//     return (
//         <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center justify-between h-16">
//                     {/* 1- Logo */}
//                     <Link href="/" className="flex items-center gap-2 ">
//                         <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
//                             <ShoppingBag className="text-white w-5 h-5" />
//                         </div>
//                         <span className="text-xl font-bold text-gray-900 dark:text-white">
//                             Shalaan
//                         </span>
//                     </Link>

//                     {/* Desktop Nav */}
//                     <div className="hidden md:flex items-center gap-6">
//                         {/* 0 */}
//                         <Link
//                             href="/"
//                             className="text-gray-600 dark:text-gray-300 hover:text-indigo-600  dark:hover:text-indigo-400 transition-colors font-medium"
//                         >
//                             Home
//                         </Link>
//                         {/* 1 */}
//                         <Link
//                             href="/products"
//                             className="text-gray-600 dark:text-gray-300 hover:text-indigo-600  dark:hover:text-indigo-400 transition-colors font-medium"
//                         >
//                             Products
//                         </Link>

//                         {/* 2 */}
//                         {isloading ? (
//                             <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
//                         ) : isAuthenticated ? (
//                             <div className="flex items-center gap-4">

//                                 <Link
//                                     href="/orders"
//                                     className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-medium transition-colors"
//                                 >
//                                     Orders
//                                 </Link>

//                                 {/* 3 */}
//                                 {/* <Link
//                                     href="/notifications"
//                                     className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
//                                     title="Notifications"
//                                 >
//                                     <Bell className="w-5 h-5" />
//                                 </Link> */}

//                                 {/* 4 */}
//                                 {user.role === "admin" && (
//                                     <Link
//                                         href="/dashboard"
//                                         className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-medium transition-colors"
//                                     >
//                                         <LayoutDashboard className="w-4 h-4" />
//                                         Admin
//                                     </Link>
//                                 )}


//                                 {/* 5 */}
//                                 <Link
//                                     href="/profile"
//                                     className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-medium transition-colors"
//                                 >
//                                     <User className="w-5 h-5" />
//                                     {/* {user.name} */}
//                                 </Link>

//                                 <Link href="/cart" className="relative">
//                                     <ShoppingCart className="text-gray-600 dark:text-white hover:text-indigo-600 transition-colors w-5 h-5" />

//                                     <span className="absolute -top-2 -right-3 bg-indigo-500 text-white text-xs min-w-4.5 h-4.5 flex items-center justify-center rounded-full px-1">
//                                         {cart.length}
//                                     </span>
//                                 </Link>

//                                 {/* 6 */}
//                                 <button
//                                     onClick={handleLogout}
//                                     className="cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600  transition-colors"
//                                 >
//                                     <LogOut className="w-4 h-4" />
//                                     Logout
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="flex items-center gap-3">
//                                 <Link href="/auth/login" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors font-medium">
//                                     Login
//                                 </Link>
//                                 <Link href="/auth/register" className="px-4 py-2 text-white rounded-lg bg-indigo-600  hover:text-indigo-700 hover:bg-indigo-50 transition-colors font-medium">
//                                     Sign Up
//                                 </Link>
//                             </div>
//                         )}
//                     </div>

//                     {/* Mobile Menu Button */}
//                     <button className="md:hidden text-gray-600 dark:text-gray-300  cursor-pointer"
//                         onClick={() => setIsMenuOpen(!isMenuOpen)}>
//                         {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//                     </button>
//                 </div>
//             </div>

//             {/* Mobile Menu Design */}
//             {isMenuOpen && (
//                 <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-4">
//                     <div className="flex flex-col gap-2 px-4">
//                         <Link href="/" className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
//                             Home
//                         </Link>
//                         <Link href="/products" className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
//                             Products
//                         </Link>
//                         {
//                             isAuthenticated ? (
//                                 <>
//                                     <Link href="/orders" className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
//                                         Orders
//                                     </Link>


//                                     {/* <Link href="/notifications" className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
//                                         Notifications
//                                     </Link> */}

//                                     {user.role === "admin" && (
//                                         <Link href="/dashboard" className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
//                                             Admin Dashboard
//                                         </Link>
//                                     )}

//                                     <Link href="/profile" className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
//                                         Profile
//                                     </Link>

//                                     <Link href="/cart" className="relative flex items-center w-fit py-2"
//                                         onClick={() => setIsMenuOpen(false)}>
//                                         <ShoppingCart className="text-white hover:text-indigo-600 transition-colors w-5 h-5" />
//                                         <span className="absolute -top-2 -right-3 bg-indigo-500 text-white text-xs min-w-4.5 h-4.5 flex items-center justify-center rounded-full px-1">
//                                             {cart.length}
//                                         </span>
//                                     </Link>

//                                     <button
//                                         className="py-2 text-gray-600 dark:text-gray-300 hover:text-red-600"
//                                         onClick={() => {
//                                             setIsMenuOpen(false);
//                                             handleLogout();
//                                         }}
//                                     >
//                                         Logout
//                                     </button>
//                                 </>
//                             ) : (
//                                 <>
//                                     <Link href="/auth/login" className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
//                                         Login
//                                     </Link>

//                                     <Link href="/auth/register" className=" py-2 text-indigo-600 font-medium" onClick={() => setIsMenuOpen(false)}>
//                                         Sign Up
//                                     </Link>
//                                 </>
//                             )}
//                     </div>
//                 </div>
//             )}
//         </nav>
//     );
// }


"use client";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";
import {
    Menu,
    X,
    ShoppingBag,
    User,
    LogOut,
    LayoutDashboard,
    ShoppingCart
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const { user, isAuthenticated, isloading, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cart } = useCart();

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                        >
                            الرئيسية
                        </Link>
                        <Link
                            href="/products"
                            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                        >
                            المنتجات
                        </Link>

                        {isloading ? (
                            <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        ) : isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                {user?.role !== "admin" && (
                                    <Link
                                        href="/orders"
                                        className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-medium transition-colors"
                                    >
                                        الطلبات
                                    </Link>
                                )}

                                {user?.role === "admin" && (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-medium transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        لوحة التحكم
                                    </Link>
                                )}

                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-medium transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                </Link>

                                <Link href="/cart" className="relative">
                                    <ShoppingCart className="text-gray-600 dark:text-white hover:text-indigo-600 transition-colors w-5 h-5" />
                                    <span className="absolute -top-2 -left-3 bg-indigo-500 text-white text-xs min-w-4.5 h-4.5 flex items-center justify-center rounded-full px-1">
                                        {cart.length}
                                    </span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    تسجيل خروج
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/login"
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors font-medium"
                                >
                                    تسجيل دخول
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="px-4 py-2 text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    إنشاء حساب
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Shalaan
                        </span>
                        <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="text-white w-5 h-5" />
                        </div>
                    </Link>
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-600 dark:text-gray-300 cursor-pointer"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-4">
                    <div className="flex flex-col gap-2 px-4">
                        <Link
                            href="/"
                            className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            الرئيسية
                        </Link>
                        <Link
                            href="/products"
                            className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            المنتجات
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {user?.role !== "admin" && (
                                    <Link
                                        href="/orders"
                                        className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        الطلبات
                                    </Link>
                                )}

                                {user?.role === "admin" && (
                                    <Link
                                        href="/dashboard"
                                        className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        لوحة التحكم
                                    </Link>
                                )}

                                <Link
                                    href="/profile"
                                    className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    الحساب
                                </Link>

                                <Link
                                    href="/cart"
                                    className="relative flex items-center w-fit py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <ShoppingCart className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors w-5 h-5" />
                                    <span className="absolute -top-2 -left-3 bg-indigo-500 text-white text-xs min-w-4.5 h-4.5 flex items-center justify-center rounded-full px-1">
                                        {cart.length}
                                    </span>
                                </Link>

                                <button
                                    className="py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 text-left"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        handleLogout();
                                    }}
                                >
                                    تسجيل خروج
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    تسجيل دخول
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="py-2 text-indigo-600 font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    إنشاء حساب
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}