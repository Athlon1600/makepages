import esbuild from "esbuild";
import vuePlugin from "esbuild-plugin-vue-next";
import {extractScripts, isExternal} from "../utils";
import {Logger} from "../Logger";

const path = require('path');

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

        buildCache.add(srcPath);
    }

    return html;
}