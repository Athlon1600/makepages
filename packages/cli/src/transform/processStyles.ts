import esbuild, {BuildResult} from "esbuild";
import {Logger} from "../Logger";
import {extractCss, createAssetHash, isExternal, isInProductionMode, replaceBetween, sizeInBytes} from "../utils";
import {StringMatchWithCompiled} from "../types";
import path from "path";
import * as fs from "node:fs";

// 14 KB rule --- https://web.dev/articles/extract-critical-css
function shouldBeMinified(str: string) {
    return sizeInBytes(str) <= 14 * 1024;
}

export const processStyles = async (html: string) => {

    const styles = extractCss(html);
    const compiledStyles: StringMatchWithCompiled[] = [];

    for (const styleMatch of styles) {
        const href = styleMatch.match;

        if (isExternal(href)) {
            Logger.debug(`Skipping external CSS: ${href}`);
            continue;
        }

        const srcPath = path.join("./src", href);

        Logger.info(`Compiling CSS: ${href}`);

        const cssBuildResult: BuildResult = await esbuild.build({
            write: false,
            entryPoints: [srcPath],
            bundle: true,
            minify: isInProductionMode(),
            platform: 'browser',
        });

        if (cssBuildResult.outputFiles) {

            const firstOutputFile = cssBuildResult.outputFiles[0];
            const cssContents = firstOutputFile.text;

            // esbuild internally uses some exotic hashing library. We want basic SHA256 instead
            // https://github.com/evanw/esbuild/pull/1107
            const hashSafe = createAssetHash(firstOutputFile.text);

            compiledStyles.push({
                ...styleMatch,
                compiled: cssContents,
                hash: hashSafe
            });
        }
    }

    // start from the bottom so that modifying html still makes match positions work
    for (const compiledStyle of compiledStyles.reverse()) {

        let newStyle: string;

        // inline it if worth it
        if (shouldBeMinified(compiledStyle.compiled)) {
            newStyle = `<style>${compiledStyle.compiled}</style>`;
        } else {

            // match = /styles/app.css
            const hrefParts = path.parse(compiledStyle.match);

            // new filename
            const newName = `${hrefParts.name}-${compiledStyle.hash}.css`;

            const newHref = hrefParts.dir + (hrefParts.dir.endsWith("/") ? "" : "/") + newName;

            // Replace "/assets/styles.css" with "/assets/styles-hash.css"
            newStyle = compiledStyle.fullMatch.replace(compiledStyle.match, newHref);

            // write to disk
            fs.writeFileSync('./dist/' + newHref, `${compiledStyle.compiled}`);
        }

        html = replaceBetween(html, compiledStyle.indexStart, compiledStyle.indexEnd, newStyle);
    }

    return html;
}