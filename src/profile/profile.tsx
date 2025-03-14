
import { useState, useEffect } from "react"
import { z } from "zod"
import { Loader2, Save, LogOut, User, Lock, CheckCircle } from "lucide-react"
import { useAuthStore } from "../store/auth-store"
import { updatePasswordSchema, updateProfileSchema } from "../lib/validator"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const navigate = useNavigate()
  const { user, updateProfile, resetPassword, logout } = useAuthStore()

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    // Initialize form with user data
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        firstName: user.fullName?.firstName || "",
        lastName: user.fullName?.lastName || "",
      })
    }
  }, [user, navigate])

  // Clear success messages after 3 seconds
  useEffect(() => {
    if (profileSuccess) {
      const timer = setTimeout(() => setProfileSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [profileSuccess])

  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => setPasswordSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [passwordSuccess])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (profileErrors[name]) {
      setProfileErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate form data
      const validatedData = updateProfileSchema.parse({
        username: profileData.username,
        email: profileData.email,
        fullName: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
        },
      })

      setIsProfileLoading(true)

      // Call update profile function from store
      await updateProfile(user?.id || "", validatedData)

      setIsProfileLoading(false)
      setProfileSuccess(true)
    } catch (error) {
      setIsProfileLoading(false)

      if (error instanceof z.ZodError) {
        // Format Zod errors
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.join(".")
          formattedErrors[path] = err.message
        })
        setProfileErrors(formattedErrors)
      } else {
        // Handle API errors
        setProfileErrors({ form: "Failed to update profile. Please try again." })
      }
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors({ confirmPassword: "Passwords do not match" })
      return
    }

    try {
      // Validate form data
      const validatedData = updatePasswordSchema.parse({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      setIsPasswordLoading(true)

      // Call reset password function from store
      await resetPassword(user?.id || "", validatedData)

      setIsPasswordLoading(false)
      setPasswordSuccess(true)

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setIsPasswordLoading(false)

      if (error instanceof z.ZodError) {
        // Format Zod errors
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.join(".")
          formattedErrors[path] = err.message
        })
        setPasswordErrors(formattedErrors)
      } else {
        // Handle API errors
        setPasswordErrors({ form: "Failed to update password. Please try again." })
      }
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Profile Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <User className="h-6 w-6 text-indigo-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                </div>

                {profileSuccess && (
                  <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Profile updated successfully!</p>
                  </div>
                )}

                {profileErrors.form && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{profileErrors.form}</div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full border ${
                        profileErrors.username ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {profileErrors.username && <p className="mt-1 text-sm text-red-600">{profileErrors.username}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full border ${
                        profileErrors.email ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {profileErrors.email && <p className="mt-1 text-sm text-red-600">{profileErrors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full border ${
                          profileErrors["fullName.firstName"] ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                      {profileErrors["fullName.firstName"] && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors["fullName.firstName"]}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full border ${
                          profileErrors["fullName.lastName"] ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                      {profileErrors["fullName.lastName"] && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors["fullName.lastName"]}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProfileLoading}
                      className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProfileLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <Lock className="h-6 w-6 text-indigo-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
                </div>

                {passwordSuccess && (
                  <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Password updated successfully!</p>
                  </div>
                )}

                {passwordErrors.form && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{passwordErrors.form}</div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`mt-1 block w-full border ${
                        passwordErrors.currentPassword ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`mt-1 block w-full border ${
                        passwordErrors.newPassword ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`mt-1 block w-full border ${
                        passwordErrors.confirmPassword ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isPasswordLoading}
                      className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPasswordLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

