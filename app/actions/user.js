// Server action to get current user for client components
"use server"

import { getCurrentUser } from "@/lib/session"

/**
 * Server action to fetch current user
 * Safe to call from client components
 * @returns {Promise<Object|null>} - User object or null
 */
export async function fetchCurrentUser() {
  try {
    return await getCurrentUser()
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return null
  }
}
