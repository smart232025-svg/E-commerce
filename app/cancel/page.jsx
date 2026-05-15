"use client"
import Link from "next/link"
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react"

export default function cancelPage() {
    return (
        <div className="p-4 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 flex items-center justify-center rounded-full mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    تم إلغاء المعاملة                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    تم إلغاء عملية الدفع , من فضلك حاول مرة أخرى                </p>

                <div className="flex flex-col sm:flex-row gap-4" >
                    <Link href="/products" className="flex-1 inline-flex  bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg items-center justify-center gap-2 transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                        إستكمال التصفح                    </Link>

                    <Link href="/" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 
                    text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        الذهاب للرئيسية                    </Link>
                </div>

            </div>
        </div>
    )
}