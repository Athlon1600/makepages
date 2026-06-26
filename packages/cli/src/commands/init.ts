import JSZip, {JSZipObject} from "jszip";
import {Logger} from "../Logger";
import {spawnSync} from "node:child_process";

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

    // exclude apps/example directory itself
    const exampleFiles = zipObject.filter((relativePath, file: JSZipObject) => {
        return relativePath.startsWith(rootFolder) && !relativePath.endsWith(rootFolder);
    });

    for (const file of exampleFiles) {

        const relativePath = path.relative(rootFolder, file.name);

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

function npmInstall() {

    // maybe use cross-spawn instead?
    const runShell = process.platform === "win32";

    Logger.info("Installing dependencies...");

    const result = spawnSync("npm", ["install"], {
        stdio: "pipe",
        shell: runShell,
        timeout: 60 * 1000
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error(`npm install failed with exit code ${result.status}`);
    }

    Logger.info("Dependencies installed successfully!");
}

async function initCurrentDirectory() {

    await initFiles();

    // package.json better exist in current dir
    npmInstall();
}

export const init = initCurrentDirectory;
