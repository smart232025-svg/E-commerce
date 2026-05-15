"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation"; // ← أضف الاستيراد ده

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const router = useRouter();

  const totalPrice = cart.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0,
  );

  // ← غير الدالة دي
  const handleCheckout = () => {
    // لو السلة فاضية، متعملش حاجة
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    // حول العميل لصفحة الدفع اللي فيها الفورم
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* HEADER */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-10 h-10" />

            <div>
              <h1 className="text-3xl font-bold">سلة التسوق</h1>

              <p className="text-orange-100">
                راجع منتجاتك قبل تأكيد الدفع              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {cart.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-16 text-center">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-5" />

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              السلة فارغة الأن            </h2>

            <p className="text-gray-500 mb-6">
              يبدو أنك لم تقوم بإضافة أى منتجات حتى الأن            </p>

            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium hover:bg-orange-600 transition"
            >
              الذهاب للتسوق            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* SUMMARY */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  تفاصيل الطلب                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>المنتجات</span>
                    <span>{cart.length}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>الشحن</span>
                    <span>مجانى</span>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-700" />

                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>الإجمالى</span>
                    <span>{totalPrice.toFixed(2)} EGP</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold transition cursor-pointer"
                >
                  متابعة الشراء                </button>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="lg:col-span-2 space-y-5">
              {cart.map((item) => {
                if (!item.product) return null;

                return (
                  <div
                    dir="ltr"
                    key={item.product._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row gap-5"
                  >

                    {/* IMAGE */}
                    <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        fill
                        className="object-cover "
                      />
                    </div>

                    {/* INFO */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate max-w-full">
                          {item.product.title}
                        </h2>

                        <div className="mt-3 text-lg font-bold text-indigo-500">
                          {item.product.price} EGP
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center justify-between mt-5">
                        {/* QUANTITY */}
                        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden text-white">
                          <button
                            onClick={() => decreaseQuantity(item.product._id)}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="px-5 font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.product._id)}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* REMOVE */}
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-red-500 hover:text-red-600 flex items-center gap-2 cursor-pointer"
                        >
                          إزالة المنتج
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>


          </div>
        )}
      </div>
    </div>
  );
}