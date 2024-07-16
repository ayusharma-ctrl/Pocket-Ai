"use client"
import { useRouter } from "next/navigation"


export default function Home() {
  const router = useRouter();
  return (
    <main className="h-full mt-20">
      <div className="flex flex-col items-center py-8">
        <h1 className="text-xl font-bold">
          Welcome to Pocket AI
        </h1>
        <p className="text-sm font-normal">Powered by Google Gemini AI APIs</p>
        <div onClick={() => router.push("/ai-summary")} className="mt-8 text-xl font-bold text-blue-500 cursor-pointer">
          Explore
        </div>
        <span className="text-xs text-black font-light">Note: Please sign in to access the tool</span>
      </div>
    </main>
  );
}
