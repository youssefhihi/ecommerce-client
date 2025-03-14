
import type React from "react"

import { useState, useEffect } from "react"
import { z } from "zod"
import { Eye, EyeOff, ArrowLeft, Loader2, CheckCircle, Link } from "lucide-react"
import { useAuthStore } from "../store/auth-store"
import { useNavigate, useSearchParams } from "react-router-dom"
import { loginSchema } from "../lib/validator"

export default function Login() {
  const navigate = useNavigate()
  const searchParams = useSearchParams()
  const login = useAuthStore((state) => state.login)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    // Check if user just registered
    const registered = searchParams[0].get("registered")
    if (registered === "true") {
      setShowSuccessMessage(true)

      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate form data
      const validatedData = loginSchema.parse(formData)

      setIsLoading(true)

      // Call login function from store
      await login(validatedData)

      // Redirect to profile page on success
      navigate("/profile")
    } catch (error) {
      setIsLoading(false)

      if (error instanceof z.ZodError) {
        // Format Zod errors
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.join(".")
          formattedErrors[path] = err.message
        })
        setErrors(formattedErrors)
      } else {
        // Handle API errors
        setErrors({ form: "Invalid email or password. Please try again." })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to home
          </Link>

          <h2 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-gray-600">Welcome back to ShopEase</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {showSuccessMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Your account has been created successfully! You can now log in.</p>
              </div>
            )}

            {errors.form && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{errors.form}</div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <p  className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/signup"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

