"use client";
import { useRef } from "react";
import ProductCard from "@/components/ui/ProductCard";

export default function ProductSlider({ products, title }) {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === "left" ? -400 : 400;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <div className="relative group">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h2>
            </div>

            <div className="relative">
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 cursor-pointer
            bg-indigo-600  rounded-full p-3 shadow-xl
            opacity-0 group-hover:opacity-100 transition-all duration-300
            hover:bg-indigo-500 
            border border-gray-200 
            disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="السابق"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="white"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div key={product._id} className="flex-none w-[150px] sm:w-[200px] md:w-[240px] lg:w-[280px]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 cursor-pointer
            bg-indigo-600  rounded-full p-3 shadow-xl
            opacity-0 group-hover:opacity-100 transition-all duration-300
            hover:bg-indigo-500 
            border border-gray-200 
            disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="التالي"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="white"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
