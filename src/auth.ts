import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/app/utilities/shema"
import { prisma } from "./app/utilities/prisma"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ session, token }){
        if (session.user && token.sub) session.user.id = token.sub 
        return session
    }
  },
  adapter: PrismaAdapter(prisma),
  session: {strategy: 'jwt'},
  providers: [
    Credentials({
        async authorize(data){
            const validation = loginSchema.safeParse(data)
            if (!validation.success) {
                return null
            }

            const {email, password} = validation.data
                const currentUser = await prisma.user.findUnique({where: {email}})
                if (currentUser && currentUser.password && currentUser.password === password) {
                    return currentUser;
                }

                return null;
        }
    }),
    GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })

],
})