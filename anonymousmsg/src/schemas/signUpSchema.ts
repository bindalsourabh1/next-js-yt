import { z } from "zod";

export const usernameValidation = z.string().min(3, "Username must be atleast 2 characters").max(20, "Username must be less than 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can't contain special characters");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid Email" }),
    password: z.string().min(6, { message: "Password must be atleast 6 characters" }).max(10)
})
