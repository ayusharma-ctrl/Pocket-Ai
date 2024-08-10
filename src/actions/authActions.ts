"use server";
import { auth, signIn, signOut } from '@/auth';
import { dbConnect } from '@/db/dbConfig';
import { UserInterface } from '@/lib/utils';
import User from '@/models/userModel';

// method to signin
export async function signInWithGoogle() {
    await signIn("google", { redirectTo: "/" });
}

// method to signout
export async function signOutWithGoogle() {
    await signOut({ redirectTo: "/" });
}

// method to verify session
export async function isSessionExist(): Promise<Boolean> {
    try {
        const session = await auth();
        if (session) {
            return true
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

// method to get session details
export async function getSession(): Promise<UserInterface | null> {
    try {
        const session = await auth();
        if (session?.user?.name && session?.user?.email && session?.user?.image) {
            return {
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

// method to save new user to db
export async function saveUser(userData: UserInterface) {
    try {
        if (userData) {
            dbConnect();
            const userExist = await User.findOne({ email: userData.email });
            if (!userExist) {
                const newUser = new User({
                    name: userData.name,
                    email: userData.email,
                    avatar: userData.image,
                });
                await newUser.save();
            }
        }
    } catch (error) {
        console.error("Error saving user:", error);
    }
}