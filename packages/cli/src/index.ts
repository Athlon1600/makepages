import {build} from "./commands/build";
import {serve} from "./commands/serve";
import {cleanCommand} from "./commands/clean";

async function _runCli(): Promise<void> {

    const args: string[] = process.argv.slice(2) || [];

    const isProduction = args.includes("--production") || args.includes("--prod");
    const isWatchMode = args.includes('--watch');

    const action = process.argv[2] || null;

    if (action === null) {

        const helpMessage = `
        
        Usage:
        makepages build --watch
        makepages build --production
        makepages serve
        
        `;
        console.log(helpMessage);
        process.exit(0);
    }

    if (action === 'build') {
        await build(isWatchMode);
    } else if (action == "clean") {
        await cleanCommand();
    } else if (action === "serve") {
        serve();
    }

    if (action === "version") {

        const {version} = require("../package.json");
        console.log(version);
    }
}

export const runCli = _runCli;