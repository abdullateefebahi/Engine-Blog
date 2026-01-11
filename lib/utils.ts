import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function portableTextToPlainText(blocks: any[] = []) {
    if (!blocks || !Array.isArray(blocks)) return "";
    return blocks
        .map((block) => {
            if (block._type !== "block" || !block.children) {
                return "";
            }
            return block.children.map((child: any) => child.text).join("");
        })
        .join("\n\n");
}

export function formatDate(date: string | Date, options: Intl.DateTimeFormatOptions = {}) {
    try {
        return new Date(date).toLocaleString("en-US", {
            timeZone: "Africa/Lagos",
            ...options,
        });
    } catch (e) {
        return new Date(date).toLocaleString("en-US", options);
    }
}
