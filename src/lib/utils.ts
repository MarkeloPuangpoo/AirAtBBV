import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatTime(timestamp: number): string {
    if (!timestamp) return "N/A";
    // Timestamp is in seconds, convert to milliseconds
    return new Date(timestamp * 1000).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        day: "numeric",
        month: "short",
    });
}

export type AQILevel = "good" | "moderate" | "unhealthy";

export function getAQILevel(pm25: number): AQILevel {
    if (pm25 <= 25) return "good";
    if (pm25 <= 50) return "moderate";
    return "unhealthy";
}

export function getAQIStatus(pm25: number): string {
    if (pm25 <= 25) return "Good / Air is Clean";
    if (pm25 <= 50) return "Moderate";
    return "Unhealthy";
}

export function getAQIColor(pm25: number) {
    const level = getAQILevel(pm25);

    switch (level) {
        case "good":
            return {
                text: "text-emerald-500",
                bg: "bg-emerald-500",
                bgLight: "bg-emerald-500/10",
                border: "border-emerald-500/20",
                gradientString: "from-emerald-500 to-teal-400",
            };
        case "moderate":
            return {
                text: "text-amber-500",
                bg: "bg-amber-500",
                bgLight: "bg-amber-500/10",
                border: "border-amber-500/20",
                gradientString: "from-amber-500 to-orange-400",
            };
        case "unhealthy":
            return {
                text: "text-rose-500",
                bg: "bg-rose-500",
                bgLight: "bg-rose-500/10",
                border: "border-rose-500/20",
                gradientString: "from-rose-500 to-red-500",
            };
    }
}
