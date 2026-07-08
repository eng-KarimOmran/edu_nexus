import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createDataWithKeys(num: number = 1): string[] {
  return Array.from({ length: num }, (_, i) => `key-${i}`);
}