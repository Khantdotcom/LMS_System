import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if(!user || !user.password) return null // No user or user uses Google

                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (passwordsMatch) return user
                return null
            }
        })
    ],
    callbacks: {
        async session({ session, user, token }) {
            if (session.user) {
                // Pass the User ID to the session so we can use it everywhere
                session.user.id = token.sub as string
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id.toString()
            }
            return token
        }
    },
    session: { strategy: "jwt" }, // JSON Web Tokens are easier for scaling
    pages: {
        signIn: '/login', // Custom login page
        newUser: '/onboarding' // Redirect here after signup
    }
})