"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import ProductSlider from "@/components/ui/ProductSlider";
import {
  ShoppingBag,
  Loader2,
  Package,
} from "lucide-react";
import Image from "next/image";

function HomeContent() {
  const { isAuthenticated, isloading } = useAuth();
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true); // مفيش تغيير هنا

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setAllProducts(data);
        } else {
          setAllProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setAllProducts([]);
      } finally {
        setProductsLoading(false); // اللودر بيختفي بعد ما البيانات تجيب
      }
    };
    fetchProducts();
  }, []);

  const groupedProducts = allProducts.reduce((acc, product) => {
    const category = product.category || "منتجات أخرى";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      <section className="relative overflow-hidden">
        <Image
          alt="Hero Image"
          src="/images/homeBackground.jpeg"
          width={900}
          height={500}
          className="block w-screen max-w-none h-auto lg:h-75"
          priority
        />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">

        {/* ===== لودر التحميل ===== */}
        {productsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* المنتجات بعد التحميل */}
            {Object.entries(groupedProducts).map(([category, products]) => (
              <ProductSlider
                key={category}
                products={products}
                title={`قسم ${category}`}
              />
            ))}

            {/* لو مفيش منتجات خالص */}
            {allProducts.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-gray-700 font-semibold dark:text-gray-300 mb-2">
                  لا توجد منتجات
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  سيتم إضافة المنتجات قريباً
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            جاهز لبداية التصفح الآن
          </h2>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-10">
            انضم إلى آلاف العملاء الآن. تصفح منتجاتنا واعثر على ما تحتاجه بالضبط.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-2xl hover:bg-indigo-50 transition-all duration-200 shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              تصفح جميع المنتجات
            </Link>
            {!isloading && !isAuthenticated && (
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200"
              >
                إنشاء حساب مجاني
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 dark:bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Image
              src="/images/footer-logo.png"
              alt="logo"
              width={150}
              height={20}
              className="object-contain"
            />
            <div className="flex items-center gap-8">
              <Link href="/products" className="text-slate-400 hover:text-white transition-colors text-sm">
                المنتجات
              </Link>
              <span className="text-slate-600 text-sm">سياسة الخصوصية</span>
              <span className="text-slate-600 text-sm">شروط الخدمة</span>
            </div>
            <div className="text-slate-500 text-sm">
              جميع الحقوق محفوظة &copy; {new Date().getFullYear()} Elkhalil tech
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }
  return <HomeContent />;
}
