import {build} from "./commands/build";
import {serve} from "./commands/serve";
import {cleanCommand} from "./commands/clean";
import {Logger} from "./Logger";
import chalk from "chalk";
import {isCurrentDirectoryValid, packageVersion} from "./utils";
import {init} from "./commands/init";

async function _runCli(): Promise<void> {

    const args: string[] = process.argv.slice(2) || [];

    const isProduction = args.includes("--production") || args.includes("--prod");
    const isWatchMode = args.includes('--watch');
    Logger.isVerbose = args.includes('--verbose') || args.includes('--debug');

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

    if (action === "version") {
        const ver = packageVersion();
        Logger.info(`You are using MakePages version ${ver}`);
        return;
    }

    if (action === 'build') {
        await build(isWatchMode);
    } else if (action == "clean") {
        await cleanCommand();
    } else if (action === "serve") {
        serve();
    } else if (action === "init") {

        const valid = isCurrentDirectoryValid();

        if (!valid) {
            Logger.error("Current working directory is not empty.");
            process.exit(1);
        }

        try {
            await init();
        } catch (e) {
            Logger.error(e);
            process.exit(1);
        }
    }

    // 3 commands in one
    if (action === "dev") {

        if (isCurrentDirectoryValid()) {
            Logger.info("Current working directory is empty. Downloading example project....");
            await init();
        }

        build(true);
        Logger.info(chalk.blue("Watching for file changes..."));

        // wait until everything is built
        setTimeout(() => {
            serve();
        }, 800);
    }
}

export const runCli = _runCli;