"use server";
import { dbConnect } from "@/db/dbConfig";
import { IGetYoutubeSummaries, ISavedYoutubeSummary } from "@/lib/utils";
import User from "@/models/userModel";
import YoutubeSummary from "@/models/youtubeModel";
import { getSession, isSessionExist } from "./authActions";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { fetchTranscript } from "@/lib/youtube-transcript";


// method to fetch list of previously generated youtube summaries
export async function getYoutubeSummaries(email: string, page: number): Promise<IGetYoutubeSummaries | undefined> {
    try {
        if (email) {
            dbConnect();
            const userExist = await User.findOne({ email });
            if (userExist) {
                //using pagination
                const limit = 2;
                const skip = (page - 1) * limit;
                const summaries: ISavedYoutubeSummary[] = await YoutubeSummary.find({ user: userExist._id })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);
                if (summaries && summaries?.length > 0) {
                    const youtubeSummary = summaries.map(summary => ({
                        _id: summary._id,
                        videoId: summary.videoId,
                        title: summary.title,
                        summary: summary.summary,
                        user: summary.user,
                    }));
                    return { data: youtubeSummary, credits: userExist?.credits };
                }
            }
        }
    } catch (error) {
        console.error("Error fetching saved youtube summaries", error);
    }
}

// method to save a new summary
export async function saveSummaries(videoId: string, title: string, summary: string) {
    try {
        if (videoId && title && summary) {
            dbConnect();
            const session = await getSession();
            if (session) {
                const userExist = await User.findOne({ email: session.email });
                if (userExist) {
                    const newSummmary = new YoutubeSummary({
                        videoId,
                        title,
                        summary,
                        user: userExist._id
                    })
                    await newSummmary.save();

                    //update user credit count
                    await User.findByIdAndUpdate(userExist._id, {
                        $inc: { credits: 1 }
                    });
                }
            }
        }
    } catch (error) {
        console.error("Error saving summary:", error);
    }
}

// get the data in desired format
function transformData(data: any[]) {
    let text = "";

    data.forEach((item) => {
        text += item.text + " ";
    });

    return {
        data: data,
        text: text.trim(),
    };
}

// basic template to generate result
const TEMPLATE = `
    INSTRUCTIONS: 
        For the this {text} complete the following steps.
        Generate the title based on the content provided
        Summarize the following content and include 5 key topics, writing in first person using normal tone of voice.

        Write a youtube video description
            - Include heading and sections.  
            - Incorporate keywords and key takeaways

        Generate bulleted list of key points and benefits

        Return possible and best recommended key words
`;

// sending transcript and above mentioned template to open ai and receiving ai generated summary
async function generateSummary(content: string, template: string) {
    const prompt = PromptTemplate.fromTemplate(template);

    const model = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: process.env.OPENAI_MODEL ?? "gpt-4-turbo-preview",
    });

    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);

    try {
        const summary = await chain.invoke({ text: content });
        return summary;
    } catch (error) {
        if (error instanceof Error) return error.message;
    }
}

//method to generate youtube ai summaries
export async function generateSummaryService(videoId: string) {
    try {
        const userSession = await isSessionExist(); // check for authentication

        // Note: additional checks can be added such as credits before generating response

        if (userSession) {
            let transcript: Awaited<ReturnType<typeof fetchTranscript>>;
            transcript = await fetchTranscript(videoId); // extract video transcript
            const transformedData = transformData(transcript); // this will return transformed text

            let summary: Awaited<ReturnType<typeof generateSummary>>;
            summary = await generateSummary(transformedData.text, TEMPLATE); //passing transcript to generate ai summary

            return { transcript: transformedData.text, summary };
        }
    } catch (error) {
        console.error("Failed to generate summary:", error);
        if (error instanceof Error) return {transcript: error.message};
    }
}