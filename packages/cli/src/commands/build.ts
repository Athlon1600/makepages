import {globSync} from "glob";
import {rimraf} from "rimraf";
import {registerShutdownCallback} from "../registerShutdownCallback";
import {Logger} from "../Logger";
import chalk from "chalk";
import {processStyles} from "../transform/processStyles";
import {compileScripts} from "../transform/compileScripts";
import {compileNunjucks} from "../transform/compileNunjucks";
import {minifyHtml} from "../transform/minifyHtml";
import {isInProductionMode} from "../utils";

const chokidar = require("chokidar");
const fs = require("fs");
const path = require('path');

async function copyPublicToDist() {
    fs.mkdirSync("./dist", {recursive: true});

    const publicPath = "./public";

    if (fs.existsSync(publicPath) && fs.statSync(publicPath).isDirectory()) {
        fs.cpSync(publicPath, "dist", {recursive: true});
    }
}

function createDirectoryIfNotExist(filePath: string) {

    const resultDir = path.dirname(filePath);
    fs.mkdirSync(resultDir, {recursive: true});
}

async function compilePages() {

    const pagesDir = path.join(process.cwd(), './src/pages');

    const pages = globSync(pagesDir + "/**/*.html", {absolute: false}).map((val) => {
        return `./${val}`;
    });

    if (pages.length === 0) {
        Logger.error("No pages found inside src/pages directory");
        return;
    }

    const timeStart = Date.now();

    for (const page of pages) {
        Logger.info(`Processing Page: ${page}`);

        const relativeToPages = path.relative("./src/pages", page);

        let html = fs.readFileSync(page, 'utf8');

        try {
            html = await compileNunjucks(page, html);
            html = await compileScripts(html);
            html = await processStyles(html);

            if (isInProductionMode()) {
                html = await minifyHtml(html);
            }

        } catch (e) {
            console.error(e);
        }

        const resultPath = `./dist/${relativeToPages}`;
        createDirectoryIfNotExist(resultPath);
        fs.writeFileSync(resultPath, html);
    }

    const duration = Date.now() - timeStart;

    Logger.info(chalk.green(`Built ${pages.length} files in ${duration} ms`));

}

async function buildAll() {

    rimraf.rimrafSync("./dist/*", {
        glob: true
    });

    try {
        await compilePages();
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

        registerShutdownCallback(() => {
            console.log(("Exiting watch mode..."));
            watcher.close();
        });

    } else {
        await buildAll();
    }
}

export const build = builder;