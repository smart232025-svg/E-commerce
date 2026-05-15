/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, Search, Package, Loader2 } from "lucide-react"
import ProductCard from "@/components/ui/ProductCard"

function ProductsContent() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products")
            if (!res.ok) throw new Error("Failed to fetch products")

            const data = await res.json()

            setProducts(data)
            setFilteredProducts(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        if (!searchQuery) {
            setFilteredProducts(products)
            return
        }

        const filtered = products.filter((product) =>
            product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchQuery.toLowerCase())
        )

        setFilteredProducts(filtered)
    }, [searchQuery, products])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        )
    }

    const groupedProducts = filteredProducts.reduce((acc, product) => {
        const category = product.category || "Other"
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(product)
        return acc
    }, {})

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

            {/* HEADER */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-14">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-3">
                        <ShoppingBag className="w-10 h-10" />
                        <h1 className="text-3xl font-bold">المنتجات</h1>
                    </div>
                    <p className="text-indigo-100">
                        اختار من بين الفئات التالية                    </p>
                </div>
            </div>

            {/* SEARCH */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col sm:flex-row gap-4">

                    {/* SEARCH INPUT */}
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ابحث عن المنتج ....."
                            className="w-full pr-10 pl-4 py-3 rounded-xl
                            bg-white dark:bg-gray-800
                            border border-gray-300 dark:border-gray-600
                            text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                {/* COUNT */}
                <div className="mt-4 text-gray-600 dark:text-gray-400">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "منتج" : "منتجات"} متوفرة
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="max-w-7xl mx-auto px-6">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            )}

            {/* PRODUCTS */}
            <div className="max-w-7xl mx-auto px-6 pb-12">

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20  bg-gray-100 dark:bg-gray-700 rounded-2xl shadow">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                            غير متوفر
                        </h3>
                        <p className="text-gray-700 dark:text-gray-200">
                            ابحث عن منتج أخر
                        </p>
                    </div>
                ) : (
                    <div className="space-y-14">
                        {Object.entries(groupedProducts).map(([category, items]) => (
                            <section key={category}>

                                {/* category title */}
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="relative text-2xl font-bold text-gray-900 dark:text-white inline-block">
                                        {category} Category
                                        <span className="absolute left-0 -bottom-2 w-full h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                                    </h2>
                                </div>

                                {/* category products */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {items.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            </section>

                        ))}

                    </div>
                )}

            </div>
        </div>
    )
}

export default function ProductsPage() {
    return <ProductsContent />
}