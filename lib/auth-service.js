import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const SignupSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string(),
    fullName: z.string().min(1, { message: 'Full name is required' }),
    company: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
  });

export async function createUser(props) {
  // 1. Validation using Zod
  const validation = SignupSchema.safeParse(props);
  if (!validation.success) {
    // Combine all error messages into a single string.
    const errorMessage = validation.error.errors.map((e) => e.message).join(', ');
    throw new Error(errorMessage);
  }
  
  const { email, password, fullName, company } = validation.data;

  // 2. Check if user exists
  const existingUser = await prisma.users.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("User with this email already exists.")
  }

  // 3. Hash the password
  const hashedPassword = await bcrypt.hash(password, 12)

  // 4. Save to database
  // Assuming `id`, `createdAt`, and `updatedAt` are handled by Prisma schema defaults.
  return await prisma.users.create({
    data: {
      email,
      fullName,
      company,
      password: hashedPassword,
      role: "SOLO_USER",
    }
  })
}