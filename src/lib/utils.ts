import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface UserInterface {
  name: string;
  email: string;
  image: string;
}

export interface MessageInterface {
  text: string;
  sender: 'ai' | 'user';
}

export interface IYoutubeSummary {
  videoId: string,
  title: string,
  summary: string,
}

export interface ISavedYoutubeSummary extends IYoutubeSummary {
  _id: string,
  user: string,
}

export interface IGetYoutubeSummaries {
  data: ISavedYoutubeSummary[] | [],
  credits: number,
}

// method to extract youtube video id from video url
export function extractYouTubeID(urlOrID: string): string | null {
  // Regular expression for YouTube ID format
  const regExpID = /^[a-zA-Z0-9_-]{11}$/;

  // Check if the input is a YouTube ID
  if (regExpID.test(urlOrID)) {
    return urlOrID;
  }

  // Regular expression for standard YouTube links
  const regExpStandard = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;

  // Regular expression for YouTube Shorts links
  const regExpShorts = /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;

  // Check for standard YouTube link
  const matchStandard = urlOrID.match(regExpStandard);
  if (matchStandard) {
    return matchStandard[1];
  }

  // Check for YouTube Shorts link
  const matchShorts = urlOrID.match(regExpShorts);
  if (matchShorts) {
    return matchShorts[1];
  }

  // Return null if no match is found
  return null;
}

interface IApps {
  label: string,
  route: string,
  style: string,
}

export const MainApps: IApps[] = [
  { label: "Document Summarizer", route: "/ai-summary", style: "text-blue-500" },
  { label: "YouTube Transpiler & Summarizer", route: "/youtube-summary", style: "text-red-500" },
];

export const TestApps: IApps[] = [
  { label: "Image to Text (OCR)", route: "/ocr", style: "text-teal-500" },
  { label: "Object Detection", route: "/object-detection", style: "text-sky-500" },
  { label: "Plagiarism Checker", route: "/plagiarism-checker", style: "text-orange-500" },
];