import esbuild from "esbuild";
import {BuildResult} from "esbuild"
import vuePlugin from "esbuild-plugin-vue-next";
import {extractCss, extractScripts} from "../utils";
import * as fs from "node:fs";

const path = require('path');

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

export const processHtml = async (html: string) => {

    const scripts = extractScripts(html);

    for (const sp of scripts) {
        // say you find: /js/app.js

        const sourcePath2 = "./src/" + sp;
        const destinationPath = path.join(process.cwd(), "./dist", sp);

        await buildScript(sourcePath2, destinationPath);
    }

    const styles = extractCss(html);

    for (const sl of styles) {

        const sp = "./src/" + sl;

        const cssBuildResult: BuildResult = await esbuild.build({
            write: false,
            entryPoints: [sp],
            bundle: true,
            minify: false,
            platform: 'browser'
        });

        if (cssBuildResult.outputFiles) {

            const firstOutputFile = cssBuildResult.outputFiles[0];
            const cssContents = firstOutputFile.text;

            fs.writeFileSync("./dist/" + sl, cssContents);
        }
    }

    return html;
}