import esbuild from "esbuild";
import {BuildResult} from "esbuild"
import vuePlugin from "esbuild-plugin-vue-next";
import {extractCss, extractScripts} from "../utils";
import * as fs from "node:fs";
import {Logger} from "../Logger";

const path = require('path');

function isExternal(url: string): boolean {
    return url.startsWith("http") || url.startsWith("//");
}

async function buildScript(srcPath: string, destinationPath: string) {

    await esbuild.build({
        entryPoints: [srcPath],
        bundle: true,
        minify: true,
        outfile: destinationPath,
        platform: 'browser',
        target: ['es2015'],
        format: "iife",
        plugins: [vuePlugin()],
    });
}

const buildCache = new Set<string>;

export const processHtml = async (html: string) => {

    const scripts = extractScripts(html);

    for (const sp of scripts) {
        // say you find: /js/app.js

        if (isExternal(sp)) {
            Logger.debug(`Skipping external script: ${sp}`);
            continue;
        }

        const srcPath = path.join("./src", sp);

        if (buildCache.has(srcPath)) {
            Logger.debug(`Skipping already built script: ${srcPath}`);
            continue;
        }

        const destinationPath = path.join(process.cwd(), "./dist", sp);

        Logger.info(`Compiling JS: ${srcPath}`);
        await buildScript(srcPath, destinationPath);

        buildCache.add(srcPath);
    }

    const styles = extractCss(html);

    for (const sl of styles) {

        if (isExternal(sl)) {
            Logger.debug(`Skipping external CSS: ${sl}`);
            continue;
        }

        const srcPath = path.join("./src", sl);

        if (buildCache.has(srcPath)) {
            Logger.debug(`Skipping already built CSS: ${srcPath}`);
            continue;
        }

        Logger.info(`Compiling CSS: ${srcPath}`);

        const cssBuildResult: BuildResult = await esbuild.build({
            write: false,
            entryPoints: [srcPath],
            bundle: true,
            minify: false,
            platform: 'browser'
        });

        if (cssBuildResult.outputFiles) {

            const firstOutputFile = cssBuildResult.outputFiles[0];
            const cssContents = firstOutputFile.text;

            fs.writeFileSync(path.join("./dist", sl), cssContents);
            buildCache.add(srcPath);
        }
    }

    return html;
}