import z from "zod";

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6, {message: "password must be 6 chars or more"})
})