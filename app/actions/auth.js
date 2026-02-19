"use server"

import { createUser } from "@/lib/auth-service"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

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

export async function login(prevState, formData) {
  let isSuccess = false;

  try {
    const email = formData.get("email")
    const password = formData.get("password")

    const user = await prisma.users.findUnique({
      where: { email },
    })

    // Use a single generic check for both "user not found" and "wrong password"
    const isValid = user && (await bcrypt.compare(password, user.password));

    if (!isValid) {
      return { error: "Invalid email or password." }
    }

    // Handle session creation/JWT logic here...
    
    isSuccess = true;
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred." }
  }

  // Redirect MUST happen outside the try/catch block
  if (isSuccess) {
    redirect("/dashboard")
  }
}