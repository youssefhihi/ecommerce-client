import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
interface User {
  id: string
  username: string
  email: string
  fullName: {
    firstName: string
    lastName: string
  }
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  username: string
  email: string
  password: string
  fullName: {
    firstName: string
    lastName: string
  }
}

interface UpdateProfileData {
  username: string
  email: string
  fullName: {
    firstName: string
    lastName: string
  }
}

interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean

  login: (credentials: LoginCredentials) => Promise<void>
  registerUser: (data: RegisterData) => Promise<void>
  logout: () => void

  updateProfile: (userId: string, data: UpdateProfileData) => Promise<void>
  resetPassword: (userId: string, data: UpdatePasswordData) => Promise<void>
}

const API_BASE_URL = "/user"

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (credentials) => {
        try {

          await new Promise((resolve) => setTimeout(resolve, 1000))
          const user: User = {
            id: "user-123",
            username: credentials.email.split("@")[0],
            email: credentials.email,
            fullName: {
              firstName: "John",
              lastName: "Doe",
            },
          }

          set({ user, isAuthenticated: true })
        } catch (error) {
          console.error("Login failed:", error)
          throw error
        }
      },

      registerUser: async (data) => {
        try {

          await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: data.username,
              email: data.email,
              password: data.password,
              fullName: data.fullName,
            }),
          })

        } catch (error) {
          console.error("Registration failed:", error)
          throw error
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: async (userId, data) => {
        try {

          await fetch(`${API_BASE_URL}/profile/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })

          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  username: data.username,
                  email: data.email,
                  fullName: data.fullName,
                }
              : null,
          }))
        } catch (error) {
          console.error("Profile update failed:", error)
          throw error
        }
      },

      resetPassword: async (userId, data) => {
        try {
       
          await fetch(`${API_BASE_URL}/reset-password/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })

        } catch (error) {
          console.error("Password reset failed:", error)
          throw error
        }
      },
    }),
    {
      name: "auth-storage", 
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)

