"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { MainApps, TestApps } from "@/lib/utils";


export default function Home() {
  const router = useRouter();
  return (
    <main className="h-full mt-20">
      <div className="flex flex-col items-center py-8">
        <h1 className="text-xl font-bold">
          Welcome to Pocket AI
        </h1>
        <p className="text-sm font-normal">Powered by Google Gemini AI, Langchain, OpenAI, and TensorFlow</p>
        <div className="w-5/6 flex flex-wrap justify-start gap-8 my-8">
          <div className="w-full text-base font-bold uppercase bg-gray-100 rounded-md p-2">
            Apps
            <span className="text-xs text-black font-light capitalize"> (Please sign in to access the tools)</span>
          </div>
          {
            MainApps && MainApps.map((app, idx) =>
              <Button key={app.label + idx} onClick={() => router.push(app.route)} variant={"ghost"} className={`${app.style} my-1 text-base font-bold cursor-pointer p-2 border-2 border-black rounded-lg`} aria-label={app.label}>
                {app.label}
              </Button>)
          }
        </div>
        <div className="w-5/6 flex flex-wrap justify-start gap-8 my-8">
          <div className="w-full text-base font-bold uppercase bg-gray-100 rounded-md p-2">
            Test Apps
          </div>
          {
            TestApps && TestApps.map((app, idx) =>
              <Button key={app.label + idx} onClick={() => router.push(app.route)} variant={"ghost"} className={`${app.style} my-1 text-base font-bold cursor-pointer p-2 border-2 border-black rounded-lg`} aria-label={app.label}>
                {app.label}
              </Button>)
          }
        </div>
      </div>
    </main>
  );
}
