import chalk from "chalk";

const withPrefix = (msg: string): string => {
    const prefix = new Date().toLocaleTimeString('en-US');
    return chalk.dim(`[${prefix}] `).concat(msg);
}

interface LogOptions {
    addPrefix: boolean;
    addColors: boolean;
}

export class Logger {

    public static isVerbose: boolean = false;

    public static log(str: any) {
        console.log(withPrefix(str));
    }

    public static info(str: any) {
        console.info(withPrefix(str));
    }

    public static warn(str: any) {
        console.warn(withPrefix(chalk.yellow(str)));
    }

    public static error(str: any) {
        console.error(withPrefix(chalk.red(str)));
    }

    public static debug(str: any) {

        if (this.isVerbose) {
            str = chalk.gray('[DEBUG]', str);
            console.debug(withPrefix(str));
        }
    }
}