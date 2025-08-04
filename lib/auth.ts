import { api } from "./api"

export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "instructor" | "student"
  avatar?: string
  created_at: string
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

export const authService = {
  async register(data: {
    name: string
    email: string
    password: string
    role?: string
  }): Promise<AuthResponse> {
    const response = await api.post("/auth/register", data)
    return response.data
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  },

  async getProfile(): Promise<{ user: User }> {
    const response = await api.get("/auth/profile")
    return response.data
  },

  async updateProfile(data: { name: string }): Promise<{ user: User }> {
    const response = await api.put("/auth/profile", data)
    return response.data
  },

  setToken(token: string) {
    localStorage.setItem("token", token)
  },

  getToken(): string | null {
    return localStorage.getItem("token")
  },

  setUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user))
  },

  getUser(): User | null {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
