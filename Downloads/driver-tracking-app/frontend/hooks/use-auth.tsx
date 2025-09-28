"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { type User, type AuthState, getCurrentUser, signOut as authSignOut } from "@/lib/auth"

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const user = getCurrentUser()
    setAuthState({
      user,
      isLoading: false,
      error: null,
    })
  }, [])

  const signOut = async () => {
    try {
      await authSignOut()
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: "Failed to sign out",
      }))
    }
  }

  const setUser = (user: User | null) => {
    setAuthState((prev) => ({
      ...prev,
      user,
      error: null,
    }))
  }

  return <AuthContext.Provider value={{ ...authState, signOut, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
