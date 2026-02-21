// Authentication and authorization guard for protecting routes and components
// Provides utility functions to check authentication and permissions

import { getSession, getCurrentUser } from "@/lib/session";
import { hasPermission, isAllowedRole } from "@/lib/rbac";

/**
 * Server-side guard: Require authentication
 * @returns {Promise<Object>} - Current user object
 * @throws {Error} - If user is not authenticated
 */
export async function requireAuthentication() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  return user;
}

/**
 * Client-side guard: Check if user is authenticated (returns false instead of throwing)
 * @returns {Promise<boolean>} - True if user is authenticated
 */
export async function checkAuthentication() {
  const session = await getSession();
  return session !== null;
}

/**
 * Get user role safely
 * @returns {Promise<string|null>} - User role or null if not authenticated
 */
export async function getUserRole() {
  const user = await getCurrentUser();
  return user ? user.role : null;
}

/**
 * Check if user has specific permission without throwing
 * @param {string} permission - Permission to check
 * @returns {Promise<boolean>} - True if user has permission
 */
export async function checkPermission(permission) {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return hasPermission(user.role, permission);
}

/**
 * Check if user has specific role without throwing
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * @returns {Promise<boolean>} - True if user has one of the allowed roles
 */
export async function checkRole(allowedRoles) {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return isAllowedRole(user.role, roles);
}
