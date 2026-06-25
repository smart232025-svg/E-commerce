/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, User, Truck, CreditCard } from "lucide-react";

const EGYPT_GOVERNORATES = [
    "القاهرة",
    "الجيزة",
    "الإسكندرية",
    "القليوبية",
    "المنوفية",
    "الشرقية",
    "الغربية",
    "الدقهلية",
    "البحيرة",
    "كفر الشيخ",
    "دمياط",
    "بورسعيد",
    "الإسماعيلية",
    "السويس",
    "مطروح",
    "شمال سيناء",
    "جنوب سيناء",
    "الفيوم",
    "بني سويف",
    "المنيا",
    "أسيوط",
    "سوهاج",
    "قنا",
    "الأقصر",
    "أسوان",
    "البحر الأحمر",
    "الوادي الجديد"
];

export default function CheckoutPage() {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        governorate: "",
        notes: "",
    });

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                fullName: user.name || "",
                phone: user.phone || "",
            }));
        }
    }, [user]);

    useEffect(() => {
        if (cart.length === 0 && !loading) {
            router.push("/products");
        }
    }, [cart, router, loading]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const totalPrice = cart.reduce(
        (total, item) => total + (item.product?.price || 0) * item.quantity,
        0
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.fullName || !form.phone || !form.address || !form.governorate) {
            alert("من فضلك اكمل جميع البيانات المطلوبة");
            return;
        }

        setLoading(true);

        try {
            const cartItems = cart.map(item => ({
                product: item.product._id,
                name: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                image: item.product.imageUrl,
            }));

            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    customer: {
                        name: form.fullName,
                        phone: form.phone,
                        city: form.city,
                        governorate: form.governorate,
                        address: form.address,
                        notes: form.notes,
                    },
                    cartItems: cartItems,
                    totalAmount: totalPrice,
                    paymentMethod: paymentMethod,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.url) {
                    window.open(data.url, "_blank");
                    await clearCart();
                    router.push("/pending");
                } else {
                    await clearCart();
                    alert("تم استلام طلبك بنجاح!");
                    router.push("/products");
                }

            } else {
                alert(data.message || "حدث خطأ، حاول مرة أخرى");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("حدث خطأ في الاتصال");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && !loading) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-10 overflow-x-hidden">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-indigo-600 mb-4 sm:mb-6 hover:text-indigo-700 text-sm sm:text-base"
                >
                    <ArrowLeft className="w-4 h-4" />
                    العودة للسلة
                </Link>

                {/* Grid - تحسين للشاشات الصغيرة */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

                    {/* نموذج البيانات - عمودين في الشاشات الكبيرة */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                                بيانات التوصيل
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                                        الاسم بالكامل
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
                                            placeholder=" "
                                        />
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                                        رقم التليفون
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            required
                                            dir="ltr"
                                            className="w-full pl-10 p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
                                            placeholder=" "
                                        />
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                                        المحافظة
                                    </label>
                                    <select
                                        name="governorate"
                                        value={form.governorate}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
                                    >
                                        <option value="">اختر المحافظة</option>
                                        {EGYPT_GOVERNORATES.map(gov => (
                                            <option key={gov} value={gov}>{gov}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                                        المدينة/المنطقة
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
                                        placeholder="مدينة نصر، المعادي..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                                        العنوان بالتفصيل
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute right-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <textarea
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            required
                                            rows="3"
                                            className="w-full pr-10 p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
                                            placeholder="اسم الشارع، رقم المبنى، الطابق..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                                        ملاحظات إضافية (اختياري)
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
                                        placeholder="أي ملاحظات للتوصيل..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition disabled:opacity-50 text-sm sm:text-base"
                                >
                                    {loading ? "جاري المعالجة..." : "تأكيد الطلب"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* ملخص الطلب - يبقى في الأسفل في الموبايل */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 sticky top-24">
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                                ملخص الطلب
                            </h2>

                            <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto mb-3 sm:mb-4">
                                {cart.map((item) => (
                                    <div key={item.product._id} className="flex gap-2 text-xs sm:text-sm">
                                        <span className="flex-1 truncate text-gray-700 dark:text-gray-300">
                                            {item.product.title}
                                        </span>
                                        <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                            {item.quantity} × {item.product.price} ج.م
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-3 sm:my-4 border-gray-200 dark:border-gray-700" />

                            <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                                <div className="flex justify-between font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                                    <span>المجموع</span>
                                    <span>{totalPrice} ج.م</span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                                    <span>التوصيل</span>
                                    <span>مجاناً</span>
                                </div>
                                <div className="flex justify-between text-lg sm:text-xl font-bold text-indigo-600 pt-1.5 sm:pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <span>الإجمالي</span>
                                    <span>{totalPrice} ج.م</span>
                                </div>
                            </div>

                            <div className="border-t pt-3 sm:pt-4 border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-medium mb-2 sm:mb-3 text-gray-700 dark:text-gray-300">
                                    الدفع
                                </label>
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-xs sm:text-sm border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cash_on_delivery"
                                            checked={paymentMethod === "cash_on_delivery"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
                                        />
                                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300 truncate">
                                            الدفع عند الاستلام
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-xs sm:text-sm border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={paymentMethod === "online"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
                                        />
                                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300 truncate">
                                            دفع أونلاين
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
