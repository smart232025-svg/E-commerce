"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import ProductCard from "@/components/ui/ProductCard";
import {
  ShoppingBag,
  ArrowRight,
  Shield,
  Zap,
  Lock,
  CheckCircle,
  Loader2,
  Sparkles,
  Package,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";

function HomeContent() {
  const { isAuthenticated, isloading } = useAuth();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");

        if (res.ok) {
          const data = await res.json();
          setProducts(data.slice(0, 4));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-linear-to-br from-slate-50 via-indigo-50/50
        to-purple-50/30 dark:from-slate-950 dark:via-indigo-950/20 dark:to-purple-950/10
        "
        />
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-linear-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-[5%] w-96 h-96 bg-linear-to-tr from-blue-400/10 to-indigo-500/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 lg:gap-8 gap-12 items-center py-20 lg:py-32">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>منصة تسوق منتجات</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold  text-slate-900 dark:text-white leading-[1.1] mb-6">
                منتجات مختارة , {""}
                <span className="text-transparent bg-clip-text  bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  يتم توصيلها على الفور
                </span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mb-4 leading-relaxed">
                اكتشف مجموعتنا المختارة بعناية من المنتجات الفاخرة،
                والتي يتم توصيلها مباشرة إلى المنزل.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-slate-900 dark:bg-white
                  text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800
                  dark:hover:bg-slate-100 transition-all duration-200 shadow-lg shadow-slate-900/10"
                >
                  <ShoppingBag className="w-5 h-5" />
                  اختار المنتجات
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                {!isloading && !isAuthenticated && (
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-2 px-6 py-3.5
                    text-slate-700 dark:text-slate-300 font-semibold rounded-xl border
                    border-slate-200 dark:border-slate-700 hover:bg-slate-100
                    dark:hover:bg-slate-800/50 transition-all duration-200"
                  >
                    إنشاء حساب
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    منتجات موثوقة
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    طريقة دفع أمنة
                  </span>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <div className="aspect-square rounded-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl shadow-indigo-500/24">
                  <div
                    className="relative w-full h-full rounded-full bg-slate-50 dark:bg-slate-900
                flex items-center justify-center overflow-hidden"
                  >
                    <Image
                      width={500}
                      height={500}
                      loading="eager"
                      src="/images/preview.png"
                      alt="Hero Image"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 -left-3"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 to-transparent pointer-events-none">
                      <div className="relative w-full h-full">
                        <div className="absolute top-20 left-20 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center z-10 ">
                          <Package className="w-8 h-8 text-indigo-500" />
                        </div>

                        <div className="absolute bottom-24 right-16 w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center z-10">
                          <CreditCard className="w-6 h-6 text-purple-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-4 py-3 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      100% أمن
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      دفع بواسطة فواتيرك
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className=" py-20 lg:py-28 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              لماذا يثق العملاء بنا            </h2>

            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              نحن ملتزمون بتوفير تجربة تسوق آمنة وموثوقة عبر الإنترنت

              لعملائنا. بوابة الدفع لدينا مدعومة من

              فواتيرك وهي شركة رائدة في مجال الدفع الآمنة.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6 lg:gap-8">

            {[
              {
                icon: CreditCard,
                title: "المدفوعات أمنة",
                description:
                  "نظام دفع مدعوم بتقنية Fawaterak مع تشفير وحماية من الإحتيال رائدة في هذا المجال.",
                iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
                iconColor: "text-indigo-600 dark:text-indigo-400",
              },
              {
                icon: CheckCircle,
                title: "منتجات موثوقة",
                description:
                  "يتم فحص كل منتج بعناية للتأكد من جودته قبل إضافته إلى موقعنا.", iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
                iconColor: "text-emerald-600 dark:text-emerald-400",
              },
              {
                icon: Zap,
                title: "توصيل فوري",
                description:
                  "يتم توصيل المنتجات  فورا خلال 24 ساعة.",
                iconBg: "bg-amber-100 dark:bg-amber-900/30",
                iconColor: "text-amber-600 dark:text-amber-400",
              },
              {
                icon: Lock,
                title: "خصوصيتك فى أمان",
                description:
                  "بياناتك ملكك. لا نبيع أو نشارك معلوماتك الشخصية مطلقًا",
                iconBg: "bg - purple - 100 dark: bg - purple - 900 / 30",
                iconColor: "text-purple-600 dark:text-purple-400",
              }
            ].map((feature, index) => (
              <div key={index} className="group p-6 lg:p-8 bg-slate-50
              dark:bg-slate-800/50 rounded-2xl border border-slate-100
              dark:border-slate-700/50 hover:border-indigo-200
            dark:hover:border-indigo-800 transition-colors duration-300">

                <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section >
      {/* Featured Products Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                المنتجات المميزة
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                المنتجات الأكثر طلباً              </p>
            </div>
            <Link href="/products" className="inline-flex items-center  gap-2
          text-indigo-600 dark:text-indigo-400 font-semibold
          hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
              مشاهدة جميع المنتجات
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-100 dark:bg-slate-800/30 rounded-2xl">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                لا توجد منتجات متاحة حتى الآن.
              </p>
            </div>

          )}

        </div >
      </section>

      {/* CTA Section */}
      {/* bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 */}
      <section className="py-20 lg:py-24 bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700">
        <div className="max-w-4x1 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            جاهز لبداية التصفح الأن
          </h2>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-10">
            انضم إلى آلاف العملاء الأن. تصفح منتجاتنا
            واعثر على ما تحتاجه بالضبط.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/products" className="inline-flex items-center gap-2.5
px-8 py-4 bg-white text-indigo-700 font-semibold rounded-2xl
hover:bg-indigo-50 transition-all duration-200 shadow-lg">
              <ShoppingBag className="w-5 h-5" />
              تصفح المنتجات            </Link>
            {!isloading && !isAuthenticated && (
              <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200">
                إنشاء حساب مجانى              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 ☐ bg-slate-900 dark:bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center ">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Shalaan</span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/products" className="text-slate-400 hover:text-white transition-colors text-sm">
                المنتجات
              </Link>
              <span className="text-slate-600 text-sm">سياسة الخصوصية</span>
              <span className="text-slate-600 text-sm">شروط الخدمة</span>
            </div>

            <div className="text-slate-500 text-sm">
              جميع الحقوق محفوظة
              &copy; {new Date().getFullYear()} Shalaan
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  return <HomeContent />;
}
