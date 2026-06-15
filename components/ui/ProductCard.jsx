"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
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
            <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 h-full">

                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                        width={400}
                        height={400}
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {product.stock < 1 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="px-2 py-1 text-xs bg-red-500 text-white font-bold rounded-full">
                                غير متوفر
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-3 sm:p-4">
                    <div className="text-[10px] sm:text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1 uppercase tracking-wide">
                        {product.category}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 sm:line-clamp-1">
                        {product.title}
                    </h3>

                    <div className="flex items-center justify-between mt-2">
                        <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            {product.price.toFixed(2)} ج.م
                        </span>

                        <button
                            disabled={product.stock === 0}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product);
                            }}
                            className={`
                ${product.stock === 0
                                    ? "cursor-not-allowed bg-red-500 text-white"
                                    : productIsInCart
                                        ? "bg-green-500 text-white"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                } 
                p-1.5 sm:p-2 rounded-lg transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
                        >
                            {productIsInCart ? (
                                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
