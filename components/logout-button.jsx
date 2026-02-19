"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth"

/**
 * Logout button component
 * Client component that handles logout action
 */
export function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoggingOut}
      variant="outline"
      size="sm">
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  )
}
