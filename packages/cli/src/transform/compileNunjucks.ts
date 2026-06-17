import {PageTransformer} from "../types";
import path from "path";
import * as fs from "node:fs";

const nunjucks = require('@11ty/nunjucks');

const env = nunjucks.configure([
    "./src"
], {
    autoescape: true,
    throwOnUndefined: false
});

// Add global variables (available in ALL templates)
env.addGlobal('year', new Date().getFullYear());

export const compileNunjucks: PageTransformer = async (pageFilePath: string, html: string) => {

    const stat = fs.statSync(pageFilePath);

    const relativeToSource = path.relative("./src", pageFilePath);

    html = nunjucks.render(relativeToSource, {
        modified_at: (new Date(stat.mtimeMs)).toLocaleString(),
    });

    return html;
};