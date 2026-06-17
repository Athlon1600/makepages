import esbuild, {BuildResult} from "esbuild";
import vuePlugin from "esbuild-plugin-vue-next";
import {extractScripts, isExternal, isInProductionMode, replaceBetween} from "../utils";
import {Logger} from "../Logger";
import * as fs from "node:fs";

const path = require('path');

// "/assets/script.js" => "/assets/script-hash.js"
const buildCache = new Map<string, string>;

export const compileScripts = async (html: string) => {

    const scripts = extractScripts(html);

    for (const scriptMatch of scripts) {

        if (isExternal(scriptMatch.match)) {
            Logger.debug(`Skipping external script: ${scriptMatch.match}`);
            continue;
        }

        const srcPath = path.join("./src", scriptMatch.match);

        Logger.info(`Compiling JS: ${srcPath}`);

        const buildResult: BuildResult = await esbuild.build({
            entryPoints: [srcPath],
            bundle: true,
            minify: isInProductionMode(),
            write: false,
            platform: 'browser',
            target: ['es2015'],
            format: "iife",
            plugins: [vuePlugin()],
        });

        if (buildResult.outputFiles) {
            const firstOutputFile = buildResult.outputFiles[0];

            const hrefParts = path.parse(scriptMatch.match);

            const destinationPath = path.join(process.cwd(), "./dist", hrefParts.dir);
            fs.mkdirSync(destinationPath, {recursive: true});

            const newName = `${hrefParts.name}-${firstOutputFile.hash}.js`;

            const newPath = path.join(destinationPath, newName);
            fs.writeFileSync(newPath, firstOutputFile.text);

            const newUrl = hrefParts.dir + (hrefParts.dir.endsWith("/") ? "" : "/") + newName;
            buildCache.set(scriptMatch.match, newUrl);
        }
    }

    // replace with links to scripts with new filenames
    const reversed = scripts.reverse();

    for (const scriptMatch of reversed) {

        const newName = buildCache.get(scriptMatch.match);

        if (newName) {
            const newScript = scriptMatch.fullMatch.replace(scriptMatch.match, newName);
            html = replaceBetween(html, scriptMatch.indexStart, scriptMatch.indexEnd, newScript);
        }
    }

    return html;
}