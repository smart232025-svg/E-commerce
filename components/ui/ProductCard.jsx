"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext"
import { ShoppingCart, Check } from "lucide-react";
import Image from "next/image";
export default function ProductCard({ product }) {

    const { addToCart, cart } = useCart();

    const productIsInCart = cart.some((item) => {
        const itemProductId = item.product?._id || item.product;
        return itemProductId?.toString() === product._id?.toString();
    });


    return (
        <Link href={`/products/${product._id}`}>
            <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                        width={500}
                        height={500}
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {product.stock < 1 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-full">
                                غير متوفر حاليا                            </span>
                        </div>
                    )}
                </div>

                <div className="p-5">
                    <div
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-2 uppercase tracking-wide"
                    >
                        {product.category}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 ">
                        {product.title}
                    </h3>

                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            ج.م {product.price.toFixed(2)}
                        </span>

                        <button
                            disabled={product.stock === 0}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                addToCart(product)
                            }}
                            className={`${product.stock === 0
                                ? "cursor-not-allowed bg-red-500 text-white px-3 py-2 rounded-lg mt-2 w-fit"
                                : productIsInCart
                                    ? "bg-green-500 text-white px-3 py-2 rounded-lg mt-2 w-fit cursor-pointer"
                                    : "bg-indigo-500 text-white px-3 py-2 rounded-lg mt-2 w-fit cursor-pointer"}`}
                        >
                            {productIsInCart ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <ShoppingCart className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
