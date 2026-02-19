// Client-side hook for checking authentication and user data
// Use this in client components to access user information and permissions

"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { checkAuthentication, getUserRole, checkPermission, checkRole } from "@/lib/auth-guard"

/**
 * Hook to check if user is authenticated
 * @returns {Object} - { isAuthenticated: boolean, isLoading: boolean }
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await checkAuthentication()
      setIsAuthenticated(authenticated)
      setIsLoading(false)

      if (!authenticated) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  return { isAuthenticated, isLoading }
}

/**
 * Hook to get current user's role
 * @returns {Object} - { role: string|null, isLoading: boolean }
 */
export function useUserRole() {
  const [role, setRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      const userRole = await getUserRole()
      setRole(userRole)
      setIsLoading(false)
    }

    fetchRole()
  }, [])

  return { role, isLoading }
}

/**
 * Hook to check if user has specific permission
 * @param {string} permission - Permission to check
 * @returns {Object} - { hasPermission: boolean, isLoading: boolean }
 */
export function usePermission(permission) {
  const [hasPermission, setHasPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPerm = async () => {
      const result = await checkPermission(permission)
      setHasPermission(result)
      setIsLoading(false)
    }

    checkPerm()
  }, [permission])

  return { hasPermission, isLoading }
}

/**
 * Hook to check if user has specific role(s)
 * @param {string|string[]} allowedRoles - Single role or array of roles to check
 * @returns {Object} - { hasRole: boolean, isLoading: boolean }
 */
export function useRole(allowedRoles) {
  const [hasRole, setHasRole] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkRoleAsync = async () => {
      const result = await checkRole(allowedRoles)
      setHasRole(result)
      setIsLoading(false)
    }

    checkRoleAsync()
  }, [allowedRoles])

  return { hasRole, isLoading }
}
