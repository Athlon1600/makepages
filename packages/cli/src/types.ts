export type StringMatch = {
    indexStart: number;
    indexEnd: number;
    fullMatch: string;
    match: string;
}

export type StringMatchWithCompiled = StringMatch & { compiled: string, hash: string };

export type PageTransformer = (pageFilePath: string, fileContents: string) => Promise<string>
