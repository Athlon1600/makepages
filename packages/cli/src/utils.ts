import {StringMatch} from "./types";
import {Logger} from "./Logger";

export const extractScripts = (html: string) => {

    const scriptRegex = /<script[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi;
    const matches = [...html.matchAll(scriptRegex)];

    const result: string[] = [];

    for (const m of matches) {
        const scriptPath = m[1] as string;
        result.push(scriptPath);
    }

    return result;
}

export const extractCss = (html: string): StringMatch[] => {

    const result: StringMatch[] = [];

    const regex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;

    let match;

    while ((match = regex.exec(html)) !== null) {
        const temp: StringMatch = {
            indexStart: match.index,
            indexEnd: regex.lastIndex,
            fullMatch: match[0],
            match: match[1]
        }
        result.push(temp);
    }

    return result;
}

export function isExternal(url: string): boolean {
    return url.startsWith("http") || url.startsWith("//");
}

export function replaceBetween(str: string, startIndex: number, endIndex: number, replacement: string) {
    return str.substring(0, startIndex) + replacement + str.substring(endIndex);
}

export function sizeInBytes(str: any): number {
    return (new Blob([str])).size;
}
