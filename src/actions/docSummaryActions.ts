"use server";
import { dbConnect } from '@/db/dbConfig';
import { MessageInterface, UserInterface } from '@/lib/utils';
import Summary from '@/models/summaryModel';
import User from '@/models/userModel';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSession } from './authActions';

// method to fetch list of previously generated summaries
export async function getSummaries(email: string, page: number): Promise<MessageInterface[] | []> {
    try {
        if (email) {
            dbConnect();
            const userExist = await User.findOne({ email });
            if (userExist) {
                //using pagination
                const limit = 4;
                const skip = (page - 1) * limit;
                const summaries: MessageInterface[] = await Summary.find({ user: userExist._id })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);
                if (summaries && summaries?.length > 0) {
                    const plainSummaries = summaries.sort().map(summary => ({
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