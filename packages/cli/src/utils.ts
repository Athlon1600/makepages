import {StringMatch} from "./types";
import {Logger} from "./Logger";
import path from "path";
import fs from "fs";

const crypto = require('crypto');

export const extractScripts = (html: string) => {

    const result: StringMatch[] = [];

    const scriptRegex = /<script[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi;

    let match;

    while ((match = scriptRegex.exec(html)) !== null) {
        const temp: StringMatch = {
            indexStart: match.index,
            indexEnd: scriptRegex.lastIndex,
            fullMatch: match[0],
            match: match[1]
        }
        result.push(temp);
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

export const isInProductionMode = (): boolean => {
    return process.argv.includes("--production") || process.argv.includes("--prod");
}

export function createAssetHash(data: string, maxLength: number = 8): string {
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, maxLength);
}

export function packageVersion(): string {
    const {version} = require("../package.json");
    return version;
}

export function isCurrentDirectoryValid(): boolean {

    const currentDir = process.cwd();
    const srcPath = path.join(currentDir, 'src');
    const publicPath = path.join(currentDir, 'public');
    const packageJsonExists = fs.existsSync(path.join(currentDir, 'package.json'));

    return !packageJsonExists && !fs.existsSync(srcPath) && !fs.existsSync(publicPath);
}

export async function sleep(ms: number) {

    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
