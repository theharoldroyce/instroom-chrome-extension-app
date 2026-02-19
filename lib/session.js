// Server-only session management
// This file should only be imported in server components and server actions
// Do not import this in client components - use fetchCurrentUser() server action instead

import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "instroom_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Create a user session after successful login
 * @param {Object} user - User object with id, email, role, and fullName
 * @returns {Promise<void>}
 */
export async function createSession(user) {
  if (!user || !user.id) {
    throw new Error("Invalid user data for session creation");
  }

  const sessionData = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName || "",
    role: user.role || "SOLO_USER",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_DURATION).toISOString(),
  };

  // Store session in cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: "/",
  });
}

/**
 * Get the current user session
 * @returns {Promise<Object|null>} - Session object or null if not logged in
 */
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const sessionData = JSON.parse(sessionCookie.value);

    // Check if session has expired
    if (new Date(sessionData.expiresAt) < new Date()) {
      await destroySession();
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error("Error reading session:", error);
    return null;
  }
}

/**
 * Extend the current session expiration
 * @returns {Promise<void>}
 */
export async function extendSession() {
  const session = await getSession();

  if (!session) {
    throw new Error("No active session to extend");
  }

  const updatedSession = {
    ...session,
    expiresAt: new Date(Date.now() + SESSION_DURATION).toISOString(),
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(updatedSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: "/",
  });
}

/**
 * Destroy the user session (logout)
 * @returns {Promise<void>}
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get the current logged-in user
 * @returns {Promise<Object|null>} - User object or null if not logged in
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  return {
    id: session.userId,
    email: session.email,
    fullName: session.fullName,
    role: session.role,
  };
}

/**
 * Check if a user is authenticated
 * @returns {Promise<boolean>} - True if user is logged in
 */
export async function isAuthenticated() {
  const session = await getSession();
  return session !== null;
}

/**
 * Verify user authentication and get user data
 * @returns {Promise<Object>} - User object
 * @throws {Error} - If user is not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required. Please log in.");
  }

  return user;
}
