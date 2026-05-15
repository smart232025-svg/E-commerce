/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/components/providers/AuthProvider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Loader2, Plus, Pencil, Trash2, ArrowLeft, X, Save, Check, AlertCircle } from "lucide-react"
import Image from "next/image"

function ProductsContent() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        currency: "EGP",
        category: "",
        imageUrl: "",
        images: [],
        stock: 0,
        isActive: true
    })
    const [isSaving, setIsSaving] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadingExtra, setUploadingExtra] = useState(false)
    const [customCategory, setCustomCategory] = useState("")
    const [isCustomCategory, setIsCustomCategory] = useState(false)
    const fileInputRef = useRef(null)

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products/admin", {
                credentials: "include"
            })
            if (!res.ok) throw new Error("Failed")
            const data = await res.json()
            setProducts(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) router.push("/auth/login")
            else if (user?.role !== "admin") router.push("/")
        }
    }, [authLoading, isAuthenticated, user, router])

    useEffect(() => {
        if (isAuthenticated && user?.role === "admin") fetchProducts()
    }, [isAuthenticated, user])


    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product)
            setFormData({
                title: product.title,
                description: product.description,
                price: product.price,
                currency: product.currency,
                category: product.category,
                imageUrl: product.imageUrl,
                images: product.images || [],
                stock: product.stock,
                isActive: product.isActive
            })
        } else {
            setEditingProduct(null)
            setFormData({
                title: "",
                description: "",
                price: "",
                currency: "EGP",
                category: "",
                imageUrl: "",
                images: [],
                stock: "",
                isActive: true
            })
        }
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingProduct(null)
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("EDITING PRODUCT:", editingProduct)
        setIsSaving(true)
        setError("")
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                currency: formData.currency,
                category: formData.category,
                stock: Number(formData.stock),
                isActive: formData.isActive,
                imageUrl: formData.imageUrl || editingProduct?.imageUrl,
                images: formData.images || editingProduct?.images || []
            }

            const url = editingProduct
                ? `/api/products/${editingProduct._id}`
                : "/api/products"

            const res = await fetch(url, {
                method: editingProduct ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            })
            if (!res.ok) throw new Error((await res.json()).message || "Failed")
            await fetchProducts()
            closeModal()
        } catch (error) {
            setError(error.message)
        } finally {
            setIsSaving(false)
        }
    }


    const handleDelete = async (id) => {
        try {

            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (!res.ok) {
                throw new Error("Failed")
            }

            setProducts((prev) =>
                prev.filter((p) => p._id !== id)
            )

            setDeleteConfirm(null)

        } catch (error) {

            setError(error.message)

        }
    }

    // for image 
    const handleImageUpload = async (e) => {
        const file = e.target.files[0]

        if (!file) return

        try {
            setUploading(true)

            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()

            setFormData((prev) => ({
                ...prev,
                imageUrl: data.imageUrl,
            }))

        } catch (error) {
            console.error(error)
        } finally {
            setUploading(false)
        }
    }
    // for extra images
    const handleExtraImagesUpload = async (e) => {
        const files = Array.from(e.target.files)

        if (!files.length) return

        setUploadingExtra(true)

        try {
            const uploadedImages = []

            for (const file of files) {

                const data = new FormData()

                data.append("file", file)

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: data,
                })

                const uploaded = await res.json()

                if (!uploaded.imageUrl) continue

                uploadedImages.push(uploaded.imageUrl)
            }

            setFormData((prev) => ({
                ...prev,
                images: [...(prev.images || []), ...uploadedImages],
            }))
        } catch (error) {
            console.log(error)
        } finally {
            setUploadingExtra(false)
        }
    }


    if (authLoading || isLoading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin" />
            </div>
        )
    if (!isAuthenticated || user?.role !== "admin") return null

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white py-12 ">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 ">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-4 transition-colors">
                        العودة إلى لوحة التحكم
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2" >
                                <Package className="w-10 h-10" />
                                <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
                            </div>
                            <p className=" text-indigo-100">
                                إضافة ، تعديل ، حذف المنتجات
                            </p>
                        </div>
                        <button onClick={() => openModal()}
                            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100">
                            <Plus className="w-5 h-5" /> إضافة منتج
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {error && showModal && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-red-600">{error}
                        </p>
                    </div>

                )}
                {products.length === 0 ? (
                    <div className="mt-5 shadow-sm text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl dark:text-white font-semibold text-gray-700 mb-2">
                            لا يوجد منتجات حتى الأن
                        </h3>
                        <button onClick={() => openModal()}
                            className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg ">
                            <Plus className="w-5 h-5" />
                            إضافة منتج
                        </button>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 overflow-x-auto  mt-5">
                        <table dir="ltr" className="w-full border-separate border-spacing-0 ">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-200 uppercase">
                                        المنتج
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-200 uppercase">
                                        الفئة
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-200 uppercase">
                                        السعر
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-200 uppercase">
                                        المخزون
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-200 uppercase">
                                        الحالة
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-200 uppercase">
                                        الإجراء
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {products.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                    {product.imageUrl ? (
                                                        <Image
                                                            width={500}
                                                            height={500}
                                                            src={product.imageUrl}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                <span className="font-medium text-gray-900 dark:text-white line-clamp-1 max-w-32">
                                                    {product.title}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {product.category}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {product.currency} {product.price.toFixed(2)}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {product.stock}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${product.isActive
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                {product.isActive ? "متوفر" : "غير متوفر"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openModal(product)}
                                                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                                    <Pencil className="w-4 h-4" />
                                                </button>

                                                <button className="p-2 text-gray-400 hover:text-red-500"
                                                    onClick={() => handleDelete(product._id)}
                                                >
                                                    <Trash2
                                                        className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {editingProduct ? "Edit Product" : "Add Product"}
                            </h3>
                            <button onClick={closeModal} className="cursor-pointer p-2 text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">
                                        {error}
                                    </p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                    اسم المنتج
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="px-4 py-2 w-full rounded-lg border border-gray-300 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                    وصف المنتج
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={3}
                                    className="px-4 py-2 w-full rounded-lg border border-gray-300 dark:text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                        السعر
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                        العملة
                                    </label>
                                    <select
                                        value={formData.currency}
                                        onChange={(e) =>
                                            setFormData({ ...formData, currency: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:text-white dark:bg-gray-700"
                                    >
                                        <option value="EGP">ج.م</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                        الفئة
                                    </label>

                                    <select
                                        value={isCustomCategory ? "Other" : formData.category}
                                        onChange={(e) => {

                                            if (e.target.value === "Other") {
                                                setIsCustomCategory(true)
                                                setFormData({
                                                    ...formData,
                                                    category: ""
                                                })

                                            } else {
                                                setIsCustomCategory(false)
                                                setFormData({
                                                    ...formData,
                                                    category: e.target.value
                                                })
                                            }
                                        }}
                                        required
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 dark:text-white dark:bg-gray-700"
                                    >
                                        <option value="">حدد الفئة</option>

                                        <option value="Mobiles">موبايلات</option>

                                        <option value="Accessories">إكسسوارات</option>

                                        <option value="Laptops">لابتوبات</option>

                                        <option value="Headphones">سماعات</option>

                                        <option value="Gaming">ألعاب</option>

                                        <option value="Other">أخرى ...</option>
                                    </select>

                                    {isCustomCategory && (
                                        <input
                                            type="text"
                                            placeholder="Enter custom category"
                                            value={formData.category}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    category: e.target.value
                                                })
                                            }
                                            className="mt-3 px-4 py-2 w-full rounded-lg border border-gray-300 text-gray-700 dark:text-white"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                        المخزون
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) =>
                                            setFormData({ ...formData, stock: e.target.value })
                                        }
                                        required
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                    صورة المنتج                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="px-4 py-2 w-full rounded-lg border border-gray-300 dark:text-white dark:bg-gray-700"
                                />

                                {uploading && (
                                    <div className="flex items-center gap-2 mt-3 text-sm text-indigo-600">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        جارى رفع الصورة...
                                    </div>
                                )}


                                {formData.imageUrl && !uploading && (
                                    <div className="relative w-32 h-32 mt-3">

                                        <Image
                                            width={500}
                                            height={500}
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-lg border"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    imageUrl: "",
                                                }))

                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = ""
                                                }
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                    </div>
                                )}

                            </div>
                            {/* for extra images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                    صور إضافية                                </label>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleExtraImagesUpload}
                                    className="w-full border border-gray-300 rounded-lg p-2 dark:text-white dark:bg-gray-700"
                                />
                            </div>

                            {uploadingExtra && (
                                <div className="flex items-center gap-2 mt-3 text-sm text-indigo-600">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    جارى رفع المزيد من الصور ....
                                </div>
                            )}

                            {formData.images?.length > 0 && !uploadingExtra && (
                                <div className="flex gap-3 overflow-x-auto mt-4 pb-2">

                                    {formData.images.map((img, index) => (

                                        <div
                                            key={index}
                                            className="relative min-w-22.5 h-22.5"
                                        >

                                            <Image
                                                width={500}
                                                height={500}
                                                src={img}
                                                alt=""
                                                className="w-full h-full object-cover rounded-lg border"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        images: prev.images.filter((_, i) => i !== index)
                                                    }))
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                        </div>

                                    ))}

                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-indigo-600"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-white">نشط</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg bg-white"
                                >
                                    إلغاء
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSaving || uploading || uploadingExtra}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving || uploading || uploadingExtra ? (<Loader2 className="w-4 h-4 animate-spin" />) : (<Save className="w-4 h-4" />)}
                                    {editingProduct ? "تحديث" : "إنشاء"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )
            }
        </div >
    )
}

export default function AdminProductPage() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
    )
    return <ProductsContent />
}