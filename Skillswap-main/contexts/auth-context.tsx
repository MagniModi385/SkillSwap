"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  email: string
  name: string
  location?: string
  profilePicture?: string
  skillsOffered: string[]
  skillsWanted: string[]
  availability: string[]
  isPublic: boolean
  rating?: number
  joinedAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        router.push("/dashboard")
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        const newUser = await response.json()
        setUser(newUser)
        router.push("/dashboard")
        return true
      }
      return false
    } catch (error) {
      console.error("Signup failed:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        return true
      }
      return false
    } catch (error) {
      console.error("Profile update failed:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
