// API base URL
const API_BASE_URL = "/user"

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      // Try to parse error message from response
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || `API error: ${response.status}`)
      } catch (e) {
        throw new Error(`API error: ${response.status}`)
      }
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return {} as T
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// API functions
export const api = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    // Note: This is a mock since the backend doesn't have a login endpoint
    // In a real app, you would call the actual login endpoint
    return { token: "mock-token" }
  },

  register: async (data: any) => {
    return fetchAPI("/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // User profile
  getUserProfile: async (userId: string) => {
    return fetchAPI(`/profile/${userId}`)
  },

  updateProfile: async (userId: string, data: any) => {
    return fetchAPI(`/profile/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  resetPassword: async (userId: string, data: any) => {
    return fetchAPI(`/reset-password/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  deleteUser: async (userId: string) => {
    return fetchAPI(`/delete/${userId}`, {
      method: "DELETE",
    })
  },
}

