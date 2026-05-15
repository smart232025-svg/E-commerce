"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCheck, Loader2 } from "lucide-react"

export default function MarkAllReadButton() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleMarkAll = async () => {
        setLoading(true)

        try {
            const res = await fetch("/api/notifications/mark-all-read", {
                method: "PATCH",
                credentials: "include",
            })

            if (!res.ok) {
                throw new Error("Failed to mark notifications")
            }

            router.refresh()

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleMarkAll}
            disabled={loading}
            className="fixed bottom-6 left-6 z-50 p-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
            {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
                <CheckCheck className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            )}
        </button>
    )
}