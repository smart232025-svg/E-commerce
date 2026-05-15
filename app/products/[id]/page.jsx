/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft,
    Check,
    AlertCircle,
    Package,
    Loader2,
    ShoppingCart
} from "lucide-react"

import Image from "next/image"
import { useCart } from "@/context/CartContext";

function ProductContent() {
    const params = useParams()
    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedImage, setSelectedImage] = useState("")

    const { addToCart, isInCart } = useCart()
    const [addingToCart, setAddingToCart] = useState(false)

    const productInCart = isInCart(product?._id); // متغير عشان نعرف المنتج في السلة ولا لأ

    const handleAddToCart = async () => {
        if (productInCart) return;
        setAddingToCart(true)
        await addToCart(product)
        setAddingToCart(false)
    }

    useEffect(() => {
        if (product?.imageUrl) {
            setSelectedImage(product.imageUrl)
        }
    }, [product])

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`)
                if (!res.ok) {
                    throw new Error(res.status === 404 ? "Product not found" : "Failed to fetch product")
                }
                const data = await res.json()
                setProduct(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProduct()
    }, [params.id])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">{error}</h2>
                    <Link href="/products" className="inline-flex items-center gap-2 text-indigo-600 font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        العودة للمنتجات
                    </Link>
                </div>
            </div>
        )
    }

    if (!product) return null

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* رجوع */}
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 mb-4 sm:mb-8 text-sm sm:text-base"
                >
                    <ArrowLeft className="w-4 h-4" />
                    العودة للمنتجات
                </Link>

                {/* كارد المنتج */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-4 sm:p-6 md:p-8">
                        {/* شبكة متجاوبة */}
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8">

                            {/* قسم الصور - الجانب الأيمن */}
                            <div className="flex flex-col gap-3">
                                {/* الصورة الرئيسية */}
                                <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                                    {selectedImage ? (
                                        <Image
                                            width={600}
                                            height={600}
                                            src={selectedImage}
                                            alt={product.title}
                                            className="w-full h-full object-contain"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                {/* الصور الإضافية - سكرول أفقي على الموبايل */}
                                {(product.images?.length > 0 || product.imageUrl) && (
                                    <div className="relative">
                                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                            {[product.imageUrl, ...(product.images || [])]
                                                .filter(Boolean)
                                                .map((img, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedImage(img)}
                                                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition ${selectedImage === img
                                                            ? "border-indigo-600"
                                                            : "border-transparent"
                                                            }`}
                                                    >
                                                        <Image
                                                            width={80}
                                                            height={80}
                                                            src={img}
                                                            alt={`صورة ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                        </div>
                                        {/* إشارة للسكرول على الموبايل */}
                                        <div className="block lg:hidden text-center text-xs text-gray-400 mt-1">
                                            ↜ اسحب للجانب لرؤية المزيد ↝
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* قسم التفاصيل - الجانب الأيسر */}
                            <div className="flex flex-col">
                                <div className="flex-1">
                                    <span className="inline-block py-1 px-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4">
                                        {product.category}
                                    </span>

                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 break-words">
                                        {product.title}
                                    </h1>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                                        {product.description}
                                    </p>

                                    {/* حالة المخزون */}
                                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                        {product.stock > 0 ? (
                                            <>
                                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                                <span className="text-green-600 font-medium text-sm sm:text-base">
                                                    فى المخزن ({product.stock} متوفر)
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                                <span className="text-red-600 font-medium text-sm sm:text-base">
                                                    غير متوفر حالياً
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* السعر والأزرار */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 mt-2">
                                    <div className="mb-4 sm:mb-6">
                                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                            {product.currency} {product.price.toFixed(2)}
                                        </span>
                                    </div>

                                    {product.stock > 0 ? (
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={addingToCart || productInCart}
                                                className={`
                                                    w-full sm:flex-1 flex items-center justify-center gap-2 sm:gap-3 
                                                    px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg 
                                                    transition-all duration-200
                                                    ${isInCart(product._id)
                                                        ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25"
                                                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                                                    }
                                                    disabled:opacity-50 disabled:cursor-not-allowed
                                                `}
                                            >
                                                {addingToCart ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : isInCart(product._id) ? (
                                                    <>
                                                        <Check className="w-5 h-5" />
                                                        <span>فى السلة</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart className="w-5 h-5" />
                                                        <span>إضافة للسلة</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gray-300 text-gray-500 font-medium rounded-xl cursor-not-allowed text-sm sm:text-base"
                                        >
                                            غير متوفر حالياً
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ProductDetailsPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        )
    }

    return <ProductContent />
}