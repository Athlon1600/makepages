import {PageTransformer} from "../types";
import path from "path";
import * as fs from "node:fs";
import {packageVersion} from "../utils";

const nunjucks = require('@11ty/nunjucks');

const env = nunjucks.configure([
    "./src"
], {
    autoescape: true,
    throwOnUndefined: false,
    noCache: true
});

const version = packageVersion();

// Add global variables (available in ALL templates)
env.addGlobal('year', new Date().getFullYear());
env.addGlobal('version', version);

// from --- https://www.npmjs.com/package/html-loader?activeTab=readme
export const compileNunjucks: PageTransformer = async (pageFilePath: string, html: string) => {

    const stat = fs.statSync(pageFilePath);

    const relativeToSource = path.relative("./src", pageFilePath);

    // Get path relative to ./src/pages
    let filePathPosix = path.relative("./src/pages", pageFilePath);
    filePathPosix = filePathPosix.replace(/\\/g, "/");

    const githubLink = `https://github.com/Athlon1600/makepages/tree/master/apps/example/src/pages/${filePathPosix}`;

    html = nunjucks.render(relativeToSource, {
        modified_at: (new Date(stat.mtimeMs)).toLocaleString(),
        github_link: githubLink
    });

    return html;
};