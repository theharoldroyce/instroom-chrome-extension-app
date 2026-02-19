"use server"

import { createUser } from "@/lib/auth-service"
import { redirect } from "next/navigation"

export async function signup(formData) {
  const email = formData.get("email")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirm-password")
  const fullName = formData.get("name")
  const company = formData.get("company")
  try {
    const newUser = await createUser({
      email,
      password,
      confirmPassword,
      fullName,
      company,
    })
    console.log("User created successfully:", newUser.id)
  } catch (error) {
    console.error("Signup error details:", {
      message: error.message,
      stack: error.stack
    })
    return { 
      error: error.message || "Something went wrong." 
    }
  }
  redirect("/dashboard")
}