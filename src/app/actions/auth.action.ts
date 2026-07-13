"use server"
import z from "zod"
import { prisma } from "../utilities/prisma"
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { loginSchema } from "@/app/utilities/shema";

const signupSchema = z.object({
    name: z.string().min(3, {message:"name must be at less 3 chars"}),
    email: z.email(),
    password: z.string().min(6, {message: "password must be 6 chars or more"})
})

export type loginData = {
    email: string,
    password: string
}

export type signupData = {
    name: string,
    email: string,
    password: string
}

export async function loginAction(data: loginData){
   try {
     const email = data.email
    const password = data.password; 
    const validation = loginSchema.safeParse({
        email,
        password
    })
    const message = validation.error?.issues.map((issues) => issues.message).join(" and ")
    if (validation.error) {
        return {success: false, message}
    }else{
        await signIn("credentials",{email, password, redirectTo: "/profile"})
         return {success: true, message: "login successfully"}
    }
   } catch (error) {
    if (error instanceof AuthError) {
        switch(error.type){
            case "CredentialsSignin":
                return {success: false, message: "invild email or password"};
            default: {
                console.log(error);
                return {success: false, message: error.message,};
            }
        }
    }
    throw error
   }
}

export async function signupAction(data: signupData){
    const name = data.name
    const email = data.email
    const password = data.password; 

    const validation = signupSchema.safeParse({
        name,
        email,
        password
    })
    
    const message = validation.error?.issues.map((issues) => issues.message).join(" and ")
    if (validation.error) {
        return {success: false, message}
    }else{

        const user = {
            name,
            email,
            password,
            image: 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'
        }

        const exitsUser = await prisma.user.findUnique({where: {email: user.email}});
        if (exitsUser?.email && exitsUser.email === user.email) {
            return {success: false, message: "user allrady exist please login!"}
        }

        const newUser = await prisma.user.create({data:user})

            

        
         return {success: true, message: "user register successfully", newUser}
    }
}

export const signout = async () =>{
    await signOut()
}