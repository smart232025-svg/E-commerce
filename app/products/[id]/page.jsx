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
    Loader2
} from "lucide-react"

import BuyButton from "@/components/ui/BuyButton"
import Image from "next/image"

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
function ProductContent() {

    const params = useParams()

    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedImage, setSelectedImage] = useState("")

    const { addToCart, isInCart } = useCart(); // أضف السطر ده
    const [addingToCart, setAddingToCart] = useState(false); // أضف ده مع الـ states التانية

    const handleAddToCart = async () => {
        setAddingToCart(true);
        await addToCart(product);
        setAddingToCart(false);
    };

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
                    throw new Error(
                        res.status === 404
                            ? "Product not found"
                            : "Failed to fetch product"
                    )
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



    // loading
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        )
    }

    const handleBuyNow = async () => {

        const res = await fetch("/api/fawaterk-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                amount: product.price,
            }),
        });

        const data = await res.json();

        window.open(data.data.url, "_blank");
    };

    // error
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">

                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />

                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        {error}
                    </h2>

                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-indigo-600 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        العودة للمنتجات                    </Link>

                </div>
            </div>
        )
    }


    // no product
    if (!product) return null

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-400 mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    العودة للمنتجات                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">

                    <div className="grid md:grid-cols-2 gap-8 p-8">

                        {/* image */}
                        <div className="flex flex-col gap-4">
                            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">

                                {selectedImage ? (

                                    <Image
                                        width={500}
                                        height={500}
                                        src={selectedImage}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />


                                ) : (

                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-24 h-24 text-gray-300" />
                                    </div>

                                )}
                            </div>

                            {(product.images?.length > 0 || product.imageUrl) && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {[product.imageUrl, ...(product.images || [])]
                                        .filter(Boolean)
                                        .map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(img)}
                                                className={`min-w-20 h-20 rounded-lg overflow-hidden border-2 transition ${selectedImage === img
                                                    ? "border-indigo-600"
                                                    : "border-transparent"
                                                    }`}
                                            >
                                                <Image
                                                    width={500}
                                                    height={500}
                                                    src={img}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>


                        {/* details */}
                        <div className="flex flex-col">

                            <div className="flex-1">

                                <span className="inline-block py-1 px-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-sm font-medium rounded-full mb-4">
                                    {product.category}
                                </span>

                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    {product.title}
                                </h1>

                                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                                    {product.description}
                                </p>


                                <div className="flex items-center gap-2 mb-6">

                                    {product.stock > 0 ? (
                                        <>
                                            <Check className="w-5 h-5 text-green-500" />

                                            <span className="text-green-600 font-medium">
                                                فى المخزن ({product.stock} متوفر)
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-5 h-5 text-red-500" />

                                            <span className="text-red-600 font-medium">
                                                غير متوفر حاليا                                            </span>
                                        </>
                                    )}

                                </div>

                            </div>



                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">

                                <div className="flex items-end gap-2 mb-6">

                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {product.currency} {product.price.toFixed(2)}
                                    </span>

                                </div>

                                {product.stock > 0 ? (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={addingToCart}
                                            className={`
        w-full sm:flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200
        ${isInCart(product._id)
                                                    ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25"
                                                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                                                }
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

                                        {/* <BuyButton
                                            onClick={handleBuyNow}
                                            productId={product._id} /> */}
                                    </div>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full py-4 px-6 bg-gray-300 text-gray-500 font-medium rounded-xl cursor-not-allowed"
                                    >
                                        غير متوفر حاليا                                    </button>
                                )}

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