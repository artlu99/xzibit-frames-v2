import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function safeFetch(url: string) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    return html;
  } catch (error) {
    return null;
  }
}
