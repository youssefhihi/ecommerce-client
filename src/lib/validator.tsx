import { z } from "zod"

// Full name schema
const fullNameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
})

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
})

// Sign up schema
export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  fullName: fullNameSchema,
})

// Update profile schema
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  fullName: fullNameSchema,
})

// Update password schema
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(4, "Current password must be at least 4 characters"),
  newPassword: z.string().min(4, "New password must be at least 4 characters"),
})

