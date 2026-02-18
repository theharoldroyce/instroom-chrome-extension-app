import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function createUser({ email, password, confirmPassword, fullName, company }) {
  // 1. Basic Validation
  if (!email || !password || !fullName) {
    throw new Error("Email, full name, and password are required")
  }

  // 2. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format")
  }

  // 3. Validate password match
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match")
  }

  // 4. Validate password length
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long")
  }

  // 5. Check if user exists
  const existingUser = await prisma.users.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // 6. Hash the password
  const hashedPassword = await bcrypt.hash(password, 12)

  // 7. Save to database
  return await prisma.users.create({
    data: {
      id: crypto.randomUUID(),
      email,
      fullName,
      company,
      password: hashedPassword,
      role: "SOLO_USER",
      updatedAt: new Date(),
    }
  })
}