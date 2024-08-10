"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";


export default function Home() {
  const router = useRouter();
  return (
    <main className="h-full mt-20">
      <div className="flex flex-col items-center py-8">
        <h1 className="text-xl font-bold">
          Welcome to Pocket AI
        </h1>
        <p className="text-sm font-normal">Powered by Google Gemini AI, Langchain, and OpenAI APIs</p>
        <div className="w-3/4 flex flex-wrap justify-center gap-8 my-4">
          <Button onClick={() => router.push("/ai-summary")} variant={"ghost"} className="mt-6 text-base font-bold text-blue-500 cursor-pointer p-2 border border-black rounded-lg">
            Document Summarizer
          </Button>
          <Button onClick={() => router.push("/youtube-summary")} variant={"ghost"} className="mt-6 text-base font-bold text-red-500 cursor-pointer p-2 border border-black rounded-lg">
            YouTube Transpiler & Summarizer
          </Button>
        </div>
        <span className="text-xs text-black font-light mt-1">Note: Please sign in to access the tool</span>
      </div>
    </main>
  );
}
