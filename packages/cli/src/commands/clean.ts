import {rimraf} from "rimraf";

async function purgeCache(): Promise<void> {
    // does nothing
}

const _CLEAN = async () => {

    rimraf.rimrafSync("./dist/*", {
        glob: true
    });

    await purgeCache();
}

export const cleanCommand = _CLEAN;