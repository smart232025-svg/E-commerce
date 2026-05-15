"use client"
import { createContext, useState, useEffect, useContext } from "react"

const AuthContext = createContext()
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const res = await fetch("/api/auth/me", { credentials: "include" })
            if (res.ok) {
                const data = await res.json()
                setUser(data)
                setIsAuthenticated(true)
            }
        } catch (error) {
            console.error("Auth Check Failed:", error)
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setIsLoading(false)
        }
    }


    // Login function
    const login = async (email, password) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        })
        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || "Login failed")
        }

        const data = await res.json()
        setUser(data)
        setIsAuthenticated(true)
        return data
    }

    //register (signup) function
    const register = async (name, email, password) => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
            credentials: "include",
        })
        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || "Registration failed")
        }

        const data = await res.json()
        setUser(data)
        setIsAuthenticated(true)
        return data
    }

    //logout function
    const logout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        })
        setUser(null)
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, isLoading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}

export default AuthContext