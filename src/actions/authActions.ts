"use server";
import { auth, signIn, signOut } from '@/auth';
import { dbConnect } from '@/db/dbConfig';
import { MessageInterface, UserInterface } from '@/lib/utils';
import Summary from '@/models/summaryModel';
import User from '@/models/userModel';
import { GoogleGenerativeAI } from "@google/generative-ai";


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

// method to fetch list of previously generated summaries
export async function getSummaries(email: string): Promise<MessageInterface[] | []> {
    try {
        if (email) {
            dbConnect();
            const userExist = await User.findOne({ email });
            if (userExist) {
                const summaries: MessageInterface[] = await Summary.find({ user: userExist._id })
                if (summaries && summaries?.length > 0) {
                    const plainSummaries = summaries.map(summary => ({
                        text: summary.text,
                        sender: summary.sender,
                    }));
                    return plainSummaries;
                } else {
                    console.log("not exist");
                    return [];
                }
            } else {
                return [];
            }
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching saved summaries", error);
        return [];
    }
}

// method to save a new result
export async function saveSummaries(text: string, sender: string) {
    try {
        if (text && sender) {
            dbConnect();
            const session = await getSession();
            if (session) {
                const userExist = await User.findOne({ email: session.email });
                if (userExist) {
                    const summary = new Summary({
                        text,
                        sender,
                        user: userExist._id
                    })
                    await summary.save();
                }
            }
        }
    } catch (error) {
        console.error("Error saving summary:", error);
    }
}

// method to get AI response from Google Gimini AI API
export async function getAiSummary(input: string) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Please summarise this document." + input;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.log("Something went wrong", error);
    }
}