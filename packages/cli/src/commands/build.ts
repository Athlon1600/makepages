import {globSync} from "glob";
import {processHtml} from "../util/processHtml";
import {rimraf} from "rimraf";

const chokidar = require("chokidar");
const nunjucks = require('@11ty/nunjucks');
const fs = require("fs");
const path = require('path');

async function copyPublicToDist() {
    fs.mkdirSync("./dist", {recursive: true});
    fs.cpSync("public", "dist", {recursive: true});
}

function createDirectoryIfNotExist(filePath: string) {

    const resultDir = path.dirname(filePath);
    fs.mkdirSync(resultDir, {recursive: true});
}

async function compileSrc() {

    const env = nunjucks.configure([
        "./src"
    ], {
        autoescape: true,
        throwOnUndefined: false
    });

    // Add global variables (available in ALL templates)
    env.addGlobal('year', new Date().getFullYear());

    const pagesDir = path.join(process.cwd(), './src/pages');

    const pages = globSync(pagesDir + "/**/*.html").map((val) => {
        return `./${val}`;
    });

    for (const page of pages) {
        console.debug(`Processing Page: ${page}`);

        const relativeToSource = path.relative("./src", page);
        const relativeToPages = path.relative("./src/pages", page);

        const stat = fs.statSync(page);

        let html = nunjucks.render(relativeToSource, {
            modified_at: (new Date(stat.mtimeMs)).toLocaleString(),
        });

        html = await processHtml(html);

        const resultPath = `./dist/${relativeToPages}`;
        createDirectoryIfNotExist(resultPath);
        fs.writeFileSync(resultPath, html);
    }
}

async function buildAll() {

    rimraf.rimrafSync("./dist");

    try {
        await compileSrc();
        await copyPublicToDist();
    } catch (e) {
        console.error(e);
    }
}

async function builder(isWatchMode: boolean) {

    if (isWatchMode) {

        const watcher = chokidar.watch(["./src", "./public"], {
            ignoreInitial: true,
            usePolling: false,
            awaitWriteFinish: false
        }).on("all", (eventName, filePath) => {

            console.log(`${eventName} fired on ${filePath}`);
            buildAll();

        });

        watcher.on('ready', async () => {
            buildAll();
        });

        function endWatchMode() {
            console.log(("Exiting watch mode..."));
            watcher.close();
        }

        process.on("SIGINT", endWatchMode);
        process.on("beforeExit", endWatchMode);

    } else {
        await buildAll();
    }
}

export const build = builder;