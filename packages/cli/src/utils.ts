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

export const extractCss = (html: string) => {

    const result: string[] = [];

    const regex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;

    let match;

    while ((match = regex.exec(html)) !== null) {
        result.push(match[1]);
    }

    return result;
}