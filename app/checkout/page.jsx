"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, User, Truck, CreditCard } from "lucide-react";

// محافظات مصر
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

    // بيانات الفورم
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        governorate: "",
        notes: "",
    });

    // لو المستخدم مسجل دخول، نعبى البيانات تلقائياً
    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                fullName: user.name || "",
                phone: user.phone || "",
            }));
        }
    }, [user]);

    // لو السلة فاضية، نوديه لصفحة المنتجات
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

        // التحقق من صحة البيانات
        if (!form.fullName || !form.phone || !form.address || !form.governorate) {
            alert("من فضلك اكمل جميع البيانات المطلوبة");
            return;
        }

        setLoading(true);

        try {
            // تجهيز بيانات المنتجات للـ API
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
                    await clearCart(); // مسح السلة
                    router.push("/pending");
                } else {
                    await clearCart(); // مسح السلة
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
        return null; // useEffect هيروّحه
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
            <div className="max-w-6xl mx-auto px-4">
                {/* رجوع للسلة */}
                <Link href="/cart" className="inline-flex items-center gap-2 text-indigo-600 mb-6 hover:text-indigo-700">
                    <ArrowLeft className="w-4 h-4" />
                    العودة للسلة
                </Link>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* الفورم - يأخذ ثلثين المساحة */}
                    <div className="md:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">بيانات التوصيل</h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">الاسم بالكامل</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="  "
                                        />
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">رقم التليفون</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            required
                                            dir="ltr"
                                            className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder=""
                                        />
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">المحافظة</label>
                                    <select
                                        name="governorate"
                                        value={form.governorate}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="">اختر المحافظة</option>
                                        {EGYPT_GOVERNORATES.map(gov => (
                                            <option key={gov} value={gov}>{gov}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">المدينة/المنطقة</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="مدينة نصر، المعادي..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">العنوان بالتفصيل</label>
                                    <div className="relative">
                                        <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                        <textarea
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            required
                                            rows="3"
                                            className="w-full pr-10 p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="اسم الشارع ، رقم المبنى ، الطابق ..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">ملاحظات إضافية (اختياري)</label>
                                    <textarea
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="أي ملاحظات للتوصيل..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
                                >
                                    {loading ? "جاري المعالجة..." : "تأكيد الطلب"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* ملخص الطلب - ثلث المساحة */}
                    <div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">ملخص الطلب</h2>

                            <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                                {cart.map((item) => (
                                    <div key={item.product._id} className="flex gap-3 text-sm">
                                        <span className="flex-1 truncate text-gray-700 dark:text-gray-300">{item.product.title}</span>
                                        <span className="text-gray-600 dark:text-gray-400">{item.quantity} × {item.product.price} ج.م</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-4 border-gray-200 dark:border-gray-700" />

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                                    <span>المجموع</span>
                                    <span>{totalPrice} ج.م</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>التوصيل</span>
                                    <span>مجاناً</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-indigo-600 pt-2">
                                    <span>الإجمالي</span>
                                    <span>{totalPrice} ج.م</span>
                                </div>
                            </div>

                            {/* اختيار طريقة الدفع */}
                            <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">طريقة الدفع</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cash_on_delivery"
                                            checked={paymentMethod === "cash_on_delivery"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <Truck className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-700 dark:text-gray-300">الدفع عند الاستلام (كاش)</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={paymentMethod === "online"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <CreditCard className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-700 dark:text-gray-300">دفع أونلاين (بطاقة ائتمان)</span>
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