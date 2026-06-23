import JSZip, {JSZipObject} from "jszip";
import {Logger} from "../Logger";

const fs = require("fs");
const path = require('path');

async function fetchLatestRelease() {

    const zipUrl = "https://github.com/Athlon1600/makepages/archive/refs/heads/master.zip";

    Logger.debug(`Downloading: ${zipUrl}`);

    return fetch(zipUrl).then((res) => {
        Logger.debug(`Download status: ${res.statusText}`);
        return res.blob();
    });
}

async function readZip(data: Blob) {
    // blob does not work in Node.js
    const buff = data.arrayBuffer();
    return JSZip.loadAsync(buff);
}

async function initFiles() {

    const bytes = await fetchLatestRelease();
    const zipObject = await readZip(bytes);

    const rootFolder = "makepages-master/apps/example/";

    const exampleFiles = zipObject.filter((relativePath, file: JSZipObject) => {
        return relativePath.startsWith(rootFolder);
    });

    for (const file of exampleFiles) {

        const relativePath = path.relative(rootFolder, file.name);

        if (relativePath.startsWith("src") || relativePath.startsWith("public")) {

            // a directory we might want to create?
            if (file.dir) {
                fs.mkdirSync(relativePath, {recursive: true});
            } else {

                Logger.info(`Writing file: ${relativePath}`);

                const content = await file.async('nodebuffer');
                fs.writeFileSync(relativePath, content);
            }
        }
    }
}

export const init = initFiles;
