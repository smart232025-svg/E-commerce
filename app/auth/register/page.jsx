/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, UserPlus, User } from 'lucide-react';

function RegisterForm() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { register, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/")
        }
    }, [isAuthenticated, router])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }
        setIsLoading(true)

        try {
            await register(name, email, password)
            router.push("/")
        } catch (error) {
            setError(error.message || "Registration failed ,please try again")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        إنشاء حساب                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        إنضم إلينا اليوم                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            الإسم بالكامل                        </label>

                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                dir='ltr'
                                placeholder=""
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            البريد الالكترونى                        </label>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                dir='ltr'
                                placeholder="your@gmail.com"
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            الرقم السرى
                        </label>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                dir='ltr'
                                placeholder="..............."
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            تأكيد الرقم السرى                        </label>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                dir='ltr'
                                placeholder="..............."
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />

                            <button type='button' onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                                {confirmPassword ? (
                                    <EyeOff className='w-5 h-5' />
                                ) : (
                                    <Eye className='w-5 h-5' />
                                )}
                            </button>

                        </div>
                    </div>

                    <button type='submit' disabled={isLoading}
                        className='w-full py-3 px-4 bg-linear-to-r from-indigo-600
                    to-purple-600 text-white font-medium rounded-lg
                    hover:from-indigo-700 hover:to-purple-700 focus:ring-4
                    focus: ring-indigo-300 transition-all cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2'>
                        {isLoading ? (
                            <>
                                <Loader2 className='w-5 h-5 animate-spin' />
                                إنشاء الحساب ...
                            </>
                        ) : (
                            <>
                                إنشاء الحساب
                                <UserPlus className='w-5 h-5' />
                            </>
                        )}
                    </button>

                </form>
                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        بالفعل لديك حساب ؟{" "}
                        <Link
                            href="/auth/login"
                            className="text-indigo-600 hover:text-indigo-700 font-medium">
                            تسجيل الدخول                        </Link>
                    </p>
                </div>
            </div>
        </div >
    )
}
function LoadingFallback() {
    return (
        <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
            </div>
        </div >

    );
}
export default function LoginPage() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
            {mounted ? <RegisterForm /> : <LoadingFallback />}
        </div>
    );
}