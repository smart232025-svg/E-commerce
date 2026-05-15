"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const router = useRouter();

  // State للتحميل على الرقم (الكمية)
  const [loadingQuantity, setLoadingQuantity] = useState({});

  const setQuantityLoading = (productId, isLoading) => {
    setLoadingQuantity(prev => ({ ...prev, [productId]: isLoading }));
  };

  const handleIncrease = async (productId) => {
    setQuantityLoading(productId, true); // شغل التحميل على الرقم
    await increaseQuantity(productId);
    setQuantityLoading(productId, false); // طفي التحميل
  };

  const handleDecrease = async (productId) => {
    setQuantityLoading(productId, true);
    await decreaseQuantity(productId);
    setQuantityLoading(productId, false);
  };

  const handleRemove = async (productId) => {
    setQuantityLoading(productId, true);
    await removeFromCart(productId);
    setQuantityLoading(productId, false);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
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
              <p className="text-orange-100">راجع منتجاتك قبل تأكيد الدفع</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {cart.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-16 text-center">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-5" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              السلة فارغة الأن
            </h2>
            <p className="text-gray-500 mb-6">
              يبدو أنك لم تقوم بإضافة أى منتجات حتى الأن
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium hover:bg-orange-600 transition"
            >
              الذهاب للتسوق
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* PRODUCTS */}
            <div className="order-2 lg:order-1 lg:col-span-2 space-y-4 sm:space-y-5">
              {cart.map((item) => {
                if (!item.product) return null;

                return (
                  <div
                    key={item.product._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-5"
                  >
                    <div className="flex flex-row gap-4 sm:gap-5">
                      {/* IMAGE */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                        />
                      </div>

                      {/* INFO */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                            {item.product.title}
                          </h2>
                          <div className="mt-1 sm:mt-2 text-base sm:text-lg md:text-xl font-bold text-indigo-500">
                            {item.product.price} EGP
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center justify-between mt-3 sm:mt-4">
                          {/* QUANTITY */}
                          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                            <button
                              onClick={() => handleDecrease(item.product._id)}
                              disabled={loadingQuantity[item.product._id]}
                              className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white disabled:opacity-50"
                            >
                              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>

                            {/* الرقم اللي عليه التحميل */}
                            <div className="min-w-[48px] text-center">
                              {loadingQuantity[item.product._id] ? (
                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-indigo-600 mx-auto" />
                              ) : (
                                <span className="px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                                  {item.quantity}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handleIncrease(item.product._id)}
                              disabled={loadingQuantity[item.product._id]}
                              className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white disabled:opacity-50"
                            >
                              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>

                          {/* REMOVE */}
                          <button
                            onClick={() => handleRemove(item.product._id)}
                            disabled={loadingQuantity[item.product._id]}
                            className="text-red-500 hover:text-red-600 flex items-center gap-1 sm:gap-2 cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">إزالة المنتج</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SUMMARY */}
            <div className="order-1 lg:order-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 sticky top-24">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  تفاصيل الطلب
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    <span>المنتجات</span>
                    <span>{cart.length}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    <span>الشحن</span>
                    <span>مجانى</span>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-700" />

                  <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    <span>الإجمالى</span>
                    <span>{totalPrice.toFixed(2)} EGP</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-4 sm:mt-6 bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition cursor-pointer text-sm sm:text-base"
                >
                  متابعة الشراء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}