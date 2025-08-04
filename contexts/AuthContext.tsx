"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, authService } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    name: string
    email: string
    password: string
    role?: string
  }) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken()
      const savedUser = authService.getUser()

      if (token && savedUser) {
        try {
          // Verificar se o token ainda é válido
          const { user: currentUser } = await authService.getProfile()
          setUser(currentUser)
          authService.setUser(currentUser)
        } catch (error) {
          // Token inválido, limpar dados
          authService.logout()
          setUser(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const { user, token } = await authService.login(email, password)
    authService.setToken(token)
    authService.setUser(user)
    setUser(user)
  }

  const register = async (data: {
    name: string
    email: string
    password: string
    role?: string
  }) => {
    const { user, token } = await authService.register(data)
    authService.setToken(token)
    authService.setUser(user)
    setUser(user)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    authService.setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
