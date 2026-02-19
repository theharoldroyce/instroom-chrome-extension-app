// Role-Based Access Control (RBAC) utility
// Defines roles, permissions, and authorization logic

const ROLES = {
  ADMIN: "ADMIN",
  SOLO_USER: "SOLO_USER",
  TEAM_MEMBER: "TEAM_MEMBER",
  AGENCY_OWNER: "AGENCY_OWNER",
  GUEST: "GUEST",
};

// Define permissions for each role
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    "view_dashboard",
    "edit_dashboard",
    "manage_users",
    "manage_roles",
    "view_analytics",
    "export_data",
    "manage_settings",
  ],
  [ROLES.AGENCY_OWNER]: [
    "view_dashboard",
    "edit_dashboard",
    "view_analytics",
    "manage_team_members",
    "export_data",
  ],
  [ROLES.SOLO_USER]: [
    "view_dashboard",
    "edit_dashboard",
    "view_analytics",
  ],
  [ROLES.TEAM_MEMBER]: [
    "view_dashboard",
    "view_analytics",
  ],
  [ROLES.GUEST]: [],
};

/**
 * Check if a user has a specific permission
 * @param {string} userRole - The user's assigned role
 * @param {string} requiredPermission - The permission to check
 * @returns {boolean} - True if user has the permission
 */
export function hasPermission(userRole, requiredPermission) {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return false;
  }
  return ROLE_PERMISSIONS[userRole].includes(requiredPermission);
}

/**
 * Check if a user has one of multiple required permissions
 * @param {string} userRole - The user's assigned role
 * @param {string[]} requiredPermissions - Array of permissions to check
 * @returns {boolean} - True if user has at least one permission
 */
export function hasAnyPermission(userRole, requiredPermissions) {
  return requiredPermissions.some((permission) =>
    hasPermission(userRole, permission)
  );
}

/**
 * Check if a user has all required permissions
 * @param {string} userRole - The user's assigned role
 * @param {string[]} requiredPermissions - Array of permissions to check
 * @returns {boolean} - True if user has all permissions
 */
export function hasAllPermissions(userRole, requiredPermissions) {
  return requiredPermissions.every((permission) =>
    hasPermission(userRole, permission)
  );
}

/**
 * Check if a user role is in the allowed roles
 * @param {string} userRole - The user's assigned role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {boolean} - True if user's role is in allowed roles
 */
export function isAllowedRole(userRole, allowedRoles) {
  return allowedRoles.includes(userRole);
}

/**
 * Get all permissions for a specific role
 * @param {string} role - The role to get permissions for
 * @returns {string[]} - Array of permissions for the role
 */
export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Get all available roles
 * @returns {Object} - All available roles
 */
export function getAllRoles() {
  return ROLES;
}

/**
 * Check if a user can access a dashboard
 * @param {string} userRole - The user's assigned role
 * @returns {boolean} - True if user can access dashboard
 */
export function canAccessDashboard(userRole) {
  return hasPermission(userRole, "view_dashboard");
}

/**
 * Check if a user can edit dashboard
 * @param {string} userRole - The user's assigned role
 * @returns {boolean} - True if user can edit dashboard
 */
export function canEditDashboard(userRole) {
  return hasPermission(userRole, "edit_dashboard");
}

/**
 * Check if a user is an admin
 * @param {string} userRole - The user's assigned role
 * @returns {boolean} - True if user is admin
 */
export function isAdmin(userRole) {
  return userRole === ROLES.ADMIN;
}

/**
 * Verify authorization and throw error if not authorized
 * @param {string} userRole - The user's assigned role
 * @param {string} requiredPermission - The permission to check
 * @throws {Error} - If user does not have permission
 */
export function requirePermission(userRole, requiredPermission) {
  if (!hasPermission(userRole, requiredPermission)) {
    throw new Error(
      `Access denied. Required permission: ${requiredPermission}`
    );
  }
}

/**
 * Verify user role and throw error if role not allowed
 * @param {string} userRole - The user's assigned role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @throws {Error} - If user's role is not in allowed roles
 */
export function requireRole(userRole, allowedRoles) {
  if (!isAllowedRole(userRole, allowedRoles)) {
    throw new Error(
      `Access denied. Allowed roles: ${allowedRoles.join(", ")}`
    );
  }
}

export { ROLES, ROLE_PERMISSIONS };
