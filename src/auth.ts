import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { saveUser } from "./actions/authActions"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        // calling a method to save user info in mongodb upon google signin
        async signIn({profile}) {
            if(profile) {
                await saveUser({
                    name: profile?.name || "",
                    email: profile?.email || "",
                    image: profile?.picture || "",
                });
            }
            return true;
        }
    }
})