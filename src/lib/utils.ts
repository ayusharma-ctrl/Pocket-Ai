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